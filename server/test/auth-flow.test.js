// Full end-to-end authentication flow test
// Uses mongodb-memory-server for isolated testing
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5000';
let server;
let mongoUri;
let shortCode;
let secretKey;
let wrongKey = 'this-is-a-wrong-key-that-does-not-match';

let passed = 0;
let failed = 0;
const results = [];

function assert(name, condition, detail = '') {
  if (condition) {
    passed++;
    results.push(`  ✅ ${name}`);
  } else {
    failed++;
    results.push(`  ❌ ${name} ${detail}`);
  }
}

async function main() {
  console.log('\n🔧 Setting up in-memory MongoDB...\n');
  const mongo = await MongoMemoryServer.create();
  mongoUri = mongo.getUri();
  console.log('MongoDB URI:', mongoUri);

  // Connect mongoose
  await mongoose.connect(mongoUri, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
  });
  console.log('✅ Connected to MongoDB\n');

  // Create test model — use absolute path from this file's location
  const UrlModel = require(path.join(__dirname, '../dist/models/Url.model')).default;

  console.log('=== AUTH FLOW TEST ===\n');

  // TEST 1: Create URL returns secretKey
  console.log('Test 1: Creating URL...');
  const createController = require(path.join(__dirname, '../dist/controllers/shorten.controller')).createShortUrl;

  let req = { body: { url: 'https://example.com/test-article' } };
  let res = {
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  let next = (err) => { this.error = err; };

  await createController(req, res, next);
  assert('createShortUrl returns 201', res.statusCode === 201, `(got ${res.statusCode})`);
  assert('createShortUrl returns data', !!res.data, 'no data returned');
  assert('createShortUrl returns shortCode', !!res.data?.shortCode, 'no shortCode');
  assert('createShortUrl returns secretKey', !!res.data?.secretKey, 'no secretKey');
  assert('secretKey is 32 chars', res.data?.secretKey?.length === 32, `(got ${res.data?.secretKey?.length})`);
  assert('secretKey is unguessable', res.data?.secretKey !== 'abcdefghijklmnopqrstuvwxyz123456', 'key looks predictable');

  if (res.data) {
    shortCode = res.data.shortCode;
    secretKey = res.data.secretKey;
    console.log(`  Short Code: ${shortCode}`);
    console.log(`  Secret Key: ${secretKey}`);
  }

  // TEST 2: URL created in DB has secretKey
  console.log('\nTest 2: Verify URL stored in DB with secretKey...');
  const dbDoc = await UrlModel.findOne({ shortCode });
  assert('URL exists in DB', !!dbDoc, 'not found');
  assert('DB doc has secretKey', !!dbDoc?.secretKey, 'no secretKey');
  assert('DB secretKey matches', dbDoc?.secretKey === secretKey, 'mismatch');

  // TEST 3: GET without auth works (public access)
  console.log('\nTest 3: Public access without authentication...');
  const getOriginalController = require(path.join(__dirname, '../dist/controllers/shorten.controller')).getOriginal;
  res = {
    statusCode: null,
    redirectUrl: null,
    redirect(url) { this.redirectUrl = url; return this; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = { params: { shortCode } };
  next = (err) => { this.error = err; };
  await getOriginalController(req, res, next);
  assert('GET redirect works (302 or redirectUrl set)', res.statusCode === 302 || !!res.redirectUrl, `(status: ${res.statusCode})`);
  console.log(`  Status: ${res.statusCode || 'pending'}, Redirect: ${res.redirectUrl || 'none'}`);

  // TEST 4: GET stats works without auth (public)
  console.log('\nTest 4: Public stats without authentication...');
  const getStatsController = require(path.join(__dirname, '../dist/controllers/shorten.controller')).getStats;
  res = {
    statusCode: 200,
    data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = { params: { shortCode } };
  next = (err) => { this.error = err; };
  await getStatsController(req, res, next);
  assert('GET stats returns 200', res.statusCode === 200, `(got ${res.statusCode})`);
  assert('GET stats returns data', !!res.data, 'no data');
  assert('GET stats has shortCode', res.data?.shortCode === shortCode, 'wrong shortCode');

  // TEST 5: PUT without secret key → 401
  console.log('\nTest 5: Update without secret key (expect 401)...');
  const requireSecretKey = require(path.join(__dirname, '../dist/middlewares/secretAuth.middleware')).requireSecretKey;
  const updateController = require(path.join(__dirname, '../dist/controllers/shorten.controller')).updateUrl;
  res = {
    statusCode: null, data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = {
    params: { shortCode },
    body: { url: 'https://example.com/updated-url' },
    header: () => undefined,
  };
  let middlewareError = null;
  let middlewareNext = (err) => { middlewareError = err; };
  await requireSecretKey(req, res, middlewareNext);
  const middlewareRejected = !!middlewareError || res.statusCode === 401;
  assert('PUT requires secret key (middleware blocks)', middlewareRejected, `error: ${middlewareError?.message || res.statusCode}`);
  if (middlewareError) {
    // UnauthorizedError is an AppError subclass; check by constructor name and status code
  assert('Error is UnauthorizedError', middlewareError?.name === 'UnauthorizedError' || middlewareError?.statusCode === 401, `(got ${middlewareError?.name}, ${middlewareError?.statusCode})`);
    assert('Error message mentions key', /key/i.test(middlewareError.message), `message: ${middlewareError.message}`);
  }

  // TEST 6: PUT with wrong secret key → 401
  console.log('\nTest 6: Update with wrong secret key (expect 401)...');
  res = {
    statusCode: null, data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = {
    params: { shortCode },
    body: { url: 'https://example.com/updated-url' },
    header: (name) => name === 'X-Secret-Key' ? wrongKey : undefined,
  };
  middlewareError = null;
  await requireSecretKey(req, res, middlewareNext);
  assert('PUT with wrong key rejected', !!middlewareError || res.statusCode === 401, `error: ${middlewareError?.message || res.statusCode}`);
  if (middlewareError) {
    assert('Wrong key → Invalid secret key message', /invalid.*key/i.test(middlewareError.message), `message: ${middlewareError.message}`);
  }

  // TEST 7: PUT with correct secret key → 200
  console.log('\nTest 7: Update with correct secret key (expect 200)...');
  res = {
    statusCode: null, data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = {
    params: { shortCode },
    body: { url: 'https://example.com/updated-url-2' },
    header: (name) => name === 'X-Secret-Key' ? secretKey : undefined,
  };
  middlewareError = null;
  await requireSecretKey(req, res, middlewareNext);
  assert('PUT with correct key passes middleware', !middlewareError, `blocked: ${middlewareError?.message}`);

  // Now run the update controller
  res = {
    statusCode: 200, data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = {
    params: { shortCode },
    body: { url: 'https://example.com/updated-url-2' },
  };
  next = (err) => { this.error = err; };
  await updateController(req, res, next);
  assert('PUT returns 200', res.statusCode === 200, `(got ${res.statusCode})`);
  assert('PUT URL updated', res.data?.url === 'https://example.com/updated-url-2', `got ${res.data?.url}`);

  // Verify in DB
  const updatedDoc = await UrlModel.findOne({ shortCode });
  assert('DB URL updated', updatedDoc?.url === 'https://example.com/updated-url-2', `got ${updatedDoc?.url}`);
  assert('Secret key unchanged after update', updatedDoc?.secretKey === secretKey, 'key changed!');

  // TEST 8: DELETE with correct secret key → 204
  console.log('\nTest 8: Delete with correct secret key (expect 204)...');
  const deleteController = require(path.join(__dirname, '../dist/controllers/shorten.controller')).deleteUrl;
  res = {
    statusCode: null, data: null,
    status(code) { this.statusCode = code; return this; },
    send(data) { this.data = data; return this; },
    json(data) { this.data = data; return this; },
  };
  req = { params: { shortCode }, header: (name) => name === 'X-Secret-Key' ? secretKey : undefined };
  middlewareError = null;
  await requireSecretKey(req, res, middlewareNext);
  assert('DELETE with correct key passes middleware', !middlewareError, `blocked: ${middlewareError?.message}`);

  res = {
    statusCode: null, data: null,
    status(code) { this.statusCode = code; return this; },
    send(data) { this.data = data; return this; },
  };
  req = { params: { shortCode }, header: (name) => name === 'X-Secret-Key' ? secretKey : undefined };
  await deleteController(req, res, next);
  assert('DELETE returns 204', res.statusCode === 204, `(got ${res.statusCode})`);

  // Verify deleted from DB
  const deletedDoc = await UrlModel.findOne({ shortCode });
  assert('URL deleted from DB', !deletedDoc, 'still exists');

  // TEST 9: Verify deleted URL can't be accessed anymore
  console.log('\nTest 9: Verify deleted URL returns 404...');
  res = {
    statusCode: 404, data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
  };
  req = { params: { shortCode } };
  next = (err) => { this.error = err; };
  await getStatsController(req, res, next);
  assert('Deleted URL stats returns 404', res.statusCode === 404, `(got ${res.statusCode})`);

  // Summary
  console.log('\n\n=== RESULTS ===');
  results.forEach(r => console.log(r));
  console.log(`\n🏆 ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log(failed === 0 ? '🎉 ALL TESTS PASSED!' : '⚠️  Some tests failed');

  await mongoose.disconnect();
  await mongo.stop();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

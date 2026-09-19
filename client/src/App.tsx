import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UrlForm from "./components/UrlForm";
import UrlCard from "./components/UrlCard";
import Stats from "./components/Stats";
import SecretKeyAlert from "./components/SecretKeyAlert";
import { UrlData } from "./types/url.types";
import apiService from "./services/api.service";

function App() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);
  const [secretKeys, setSecretKeys] = useState<Record<string, string>>({});

  const handleUrlCreated = (newUrl: UrlData) => {
    setUrls([newUrl, ...urls]);
    setShowSecretKey(newUrl.secretKey);
    setSecretKeys((prev) => ({ ...prev, [newUrl.shortCode]: newUrl.secretKey }));
  };

  const handleDeleteUrl = async (shortCode: string, secretKey: string) => {
    try {
      await apiService.deleteUrl(shortCode, secretKey);
      setUrls((prev) => prev.filter((url) => url.shortCode !== shortCode));
      setSecretKeys((prev) => {
        const next = { ...prev };
        delete next[shortCode];
        return next;
      });
    } catch (error) {
      console.error("Failed to delete URL:", error);
      alert("Failed to delete URL. Please try again.");
    }
  };

  const handleVisitUrl = async (shortCode: string) => {
    try {
      const fresh = await apiService.getUrlStats(shortCode);
      setUrls((prev) => prev.map((u) =>
        u.shortCode === shortCode ? { ...u, ...fresh } : u
      ));
    } catch {
      // Stats endpoint unreachable (e.g. offline) — optimistically bump
      // so the UI still reflects the click that just happened.
      setUrls((prev) => prev.map((u) =>
        u.shortCode === shortCode ? { ...u, accessCount: u.accessCount + 1 } : u
      ));
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.accessCount, 0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#faf9f7',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div style={{ maxWidth: '900px', margin: '0 auto 48px', textAlign: 'center', padding: '60px 0 24px' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 16px',
          }}>Simplify links. <em style={{ fontStyle: 'italic', color: '#c9a227' }}>Measure impact.</em></h2>
          <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '540px', margin: '0 auto' }}>
            Create short, memorable links. Track access with a secret-key system — no login required.
          </p>
        </div>

        {/* URL Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <UrlForm onUrlCreated={handleUrlCreated} />
        </div>

        {/* Stats */}
        {urls.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <Stats totalUrls={urls.length} totalClicks={totalClicks} />
          </div>
        )}

        {/* URL List */}
        {urls.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Your Shortened URLs
            </h3>
            <div className="space-y-4">
              {urls.map((url) => (
                <UrlCard
                  key={url._id}
                  urlData={url}
                  secretKey={secretKeys[url.shortCode] || url.secretKey}
                  onDelete={handleDeleteUrl}
                  onVisit={handleVisitUrl}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No URLs Yet
            </h3>
            <p className="text-gray-500">
              Create your first short URL using the form above
            </p>
          </div>
        )}

        {/* Features */}
        <div style={{ maxWidth: '1100px', margin: '80px auto 40px', padding: '0 28px' }}>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: '48px',
            color: '#162540',
          }}>Why this shortener</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}>
            {[
              { label: 'Secret-Key Auth', desc: 'Per-URL 32-char keys. No account needed — possession grants manage rights.', icon: '01' },
              { label: 'Rate Protected', desc: 'Four-layer express-rate-limit: global, create, get, modify.', icon: '02' },
              { label: 'Serverless Cache', desc: 'Mongoose connection cached across Vercel cold starts.', icon: '03' },
            ].map((f) => (
              <div key={f.label} style={{
                background: '#f3f1ee',
                border: '1px solid #d6d3ce',
                padding: '36px 32px',
                borderRadius: '2px',
              }} role="listitem">
                <div style={{
                  width: '48px', height: '48px',
                  border: '2px solid #c9a227',
                  borderRadius: '50%',
                  display: 'grid', placeItems: 'center',
                  fontFamily: '"Playfair Display", serif', fontSize: '1.25rem',
                  color: '#c9a227', marginBottom: '18px',
                }}>{f.icon}</div>
                <h4 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 8px', color: '#162540' }}>{f.label}</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.45 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Secret Key Alert Modal */}
      {showSecretKey && (
        <SecretKeyAlert
          secretKey={showSecretKey}
          onClose={() => setShowSecretKey(null)}
        />
      )}
    </div>
  );
}

export default App;

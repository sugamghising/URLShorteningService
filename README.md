# URL Shortener API

A robust and efficient URL shortening service built with Node.js, Express, TypeScript, and MongoDB. This service allows you to create short, memorable links from long URLs, track access statistics, and manage your shortened URLs with full CRUD operations.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, easy-to-share links
- **Unique Short Codes**: Automatically generate collision-free short codes using nanoid
- **Access Tracking**: Monitor how many times each shortened URL has been accessed
- **Full CRUD Operations**: Create, read, update, and delete shortened URLs
- **Statistics**: View detailed statistics for each shortened URL
- **RESTful API**: Clean and intuitive API endpoints
- **Type Safety**: Built with TypeScript for better code quality and developer experience
- **Input Validation**: Robust validation using Zod schema validation
- **Enhanced Error Handling**: Custom error classes with proper HTTP status codes
- **Environment Validation**: Startup validation ensures all required configurations are present
- **Rate Limiting**: Multi-layer protection against abuse and DDoS attacks
- **MongoDB Integration**: Persistent storage with MongoDB and Mongoose ODM

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Recent Updates](#recent-updates)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod (input validation & environment variables)
- **ID Generation**: nanoid
- **Rate Limiting**: express-rate-limit
- **CORS**: cors middleware
- **Logging**: morgan
- **Environment**: dotenv

## 📁 Project Structure

```
UrlShortner/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # Database connection configuration
│   │   │   └── env.ts             # Environment variables validation (Zod)
│   │   ├── controllers/
│   │   │   └── shorten.controller.ts  # Business logic for URL operations
│   │   ├── middlewares/
│   │   │   ├── error.middleware.ts    # Enhanced error handling middleware
│   │   │   └── rateLimiter.middleware.ts  # Rate limiting configurations
│   │   ├── models/
│   │   │   └── Url.model.ts       # Mongoose schema and model
│   │   ├── routes/
│   │   │   └── shorten.routes.ts  # API route definitions with rate limiters
│   │   ├── schema/
│   │   │   └── shorten.schema.ts  # Zod validation schemas
│   │   ├── utils/
│   │   │   ├── generateShortCode.ts  # Short code generation utility
│   │   │   └── errors.ts          # Custom error classes
│   │   └── index.ts               # Application entry point
│   ├── .env.example               # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd UrlShortner
   ```

2. **Navigate to the server directory**

   ```bash
   cd server
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory (use `.env.example` as template):

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   CLIENT_ORIGIN=*
   BASE_URL=http://localhost:5000
   ```

   **Note**: The server will validate environment variables on startup and exit if required variables are missing.

5. **Build the project**

   ```bash
   npm run build
   ```

6. **Start the server**

   Development mode:

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   npm start
   ```

7. **Verify the server is running**

   Open your browser or use curl:

   ```bash
   curl http://localhost:5000/health
   ```

## 🔐 Environment Variables

| Variable        | Description                  | Required | Default                 |
| --------------- | ---------------------------- | -------- | ----------------------- |
| `PORT`          | Server port number           | No       | `5000`                  |
| `NODE_ENV`      | Environment mode             | No       | `development`           |
| `MONGODB_URI`   | MongoDB connection string    | **Yes**  | -                       |
| `CLIENT_ORIGIN` | Allowed CORS origin          | No       | `*`                     |
| `BASE_URL`      | Base URL for the application | No       | `http://localhost:5000` |

**Environment Validation**: The application uses Zod to validate all environment variables at startup. If required variables are missing or invalid, the server will display clear error messages and exit.

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api/shorten
```

### Endpoints

| Method   | Endpoint            | Description                                 |
| -------- | ------------------- | ------------------------------------------- |
| `POST`   | `/`                 | Create a new short URL                      |
| `GET`    | `/:shortCode`       | Get original URL and increment access count |
| `PUT`    | `/:shortCode`       | Update the original URL                     |
| `DELETE` | `/:shortCode`       | Delete a short URL                          |
| `GET`    | `/:shortCode/stats` | Get statistics for a short URL              |

### Health Check

- `GET /health` - Check if the server is running

## 🛡️ Rate Limiting

The API implements multi-layer rate limiting to protect against abuse and ensure fair usage:

### Rate Limit Configuration

| Limiter       | Window | Max Requests | Applied To                          | Purpose                     |
| ------------- | ------ | ------------ | ----------------------------------- | --------------------------- |
| **Global**    | 15 min | 200          | All endpoints                       | Overall API protection      |
| **Create**    | 15 min | 100          | `POST /api/shorten`                 | Prevent spam URL creation   |
| **Get**       | 1 min  | 60           | `GET /api/shorten/:shortCode`       | Balance access & protection |
| **Get Stats** | 1 min  | 60           | `GET /api/shorten/:shortCode/stats` | Analytics access control    |
| **Modify**    | 15 min | 30           | `PUT`, `DELETE` endpoints           | Protect write operations    |

### Rate Limit Headers

All responses include rate limit information:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1699372800
```

### Rate Limit Exceeded Response

When rate limit is exceeded, you'll receive:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```

**HTTP Status Code**: `429 Too Many Requests`

For detailed information, see [RATE_LIMITING_GUIDE.md](./RATE_LIMITING_GUIDE.md)

## 🚨 Error Handling

The API uses custom error classes for consistent error responses:

### Error Response Format

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

### HTTP Status Codes

| Status Code | Error Type            | Description                       |
| ----------- | --------------------- | --------------------------------- |
| `400`       | Bad Request           | Invalid input or validation error |
| `404`       | Not Found             | Resource doesn't exist            |
| `409`       | Conflict              | Duplicate resource                |
| `429`       | Too Many Requests     | Rate limit exceeded               |
| `500`       | Internal Server Error | Unexpected server error           |

### Custom Error Classes

The application includes the following error types:

- `ValidationError` (400)
- `NotFoundError` (404)
- `ConflictError` (409)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `InternalServerError` (500)

## 💡 Usage Examples

### Create a Short URL

**Request:**

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very-long-url"}'
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very-long-url",
  "shortCode": "abc123",
  "accessCount": 0,
  "createdAt": "2025-11-07T10:00:00.000Z",
  "updatedAt": "2025-11-07T10:00:00.000Z"
}
```

### Get Original URL

**Request:**

```bash
curl http://localhost:5000/api/shorten/abc123
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very-long-url",
  "shortCode": "abc123",
  "accessCount": 1,
  "createdAt": "2025-11-07T10:00:00.000Z",
  "updatedAt": "2025-11-07T10:00:00.000Z"
}
```

### Get Statistics

**Request:**

```bash
curl http://localhost:5000/api/shorten/abc123/stats
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very-long-url",
  "shortCode": "abc123",
  "accessCount": 42,
  "createdAt": "2025-11-07T10:00:00.000Z",
  "updatedAt": "2025-11-07T10:00:00.000Z"
}
```

### Update URL

**Request:**

```bash
curl -X PUT http://localhost:5000/api/shorten/abc123 \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.newexample.com/updated-url"}'
```

### Delete URL

**Request:**

```bash
curl -X DELETE http://localhost:5000/api/shorten/abc123
```

**Success Response:** `204 No Content`

### Error Responses

**404 Not Found:**

```json
{
  "status": "error",
  "message": "Short URL not found"
}
```

**400 Validation Error:**

```json
{
  "status": "error",
  "message": "Invalid URL format"
}
```

**429 Rate Limit Exceeded:**

```json
{
  "status": "error",
  "message": "Too many URL creation requests from this IP, please try again after 15 minutes."
}
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the production server
- `npm test` - Run tests (to be implemented)

### Code Quality

The project uses:

- **TypeScript** with strict mode enabled
- **ESM Interop** for better module compatibility
- **Source Maps** for easier debugging
- **Type Declarations** for better IDE support

## 📝 Recent Updates

### November 7, 2025 - Critical Improvements ✅

#### 1. **Route Order Fix**

- Fixed stats endpoint routing conflict
- `/:shortCode/stats` now accessible (was being caught by generic route)

#### 2. **Enhanced Error Handling**

- Implemented custom error classes (`NotFoundError`, `ValidationError`, etc.)
- Consistent error response format across all endpoints
- Proper HTTP status codes for different error types
- Better error messages for debugging

#### 3. **Environment Validation**

- Added Zod schema validation for environment variables
- Server validates configuration on startup
- Clear error messages for missing/invalid variables
- Prevents runtime errors from misconfiguration

#### 4. **Rate Limiting Implementation**

- Multi-layer rate limiting protection
- Global limiter (200 req/15min) + endpoint-specific limiters
- Prevents DDoS attacks and API abuse
- Rate limit headers in all responses
- Configurable limits per endpoint type

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or suggestions, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and TypeScript**

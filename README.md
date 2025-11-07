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
- **Error Handling**: Comprehensive error handling middleware
- **MongoDB Integration**: Persistent storage with MongoDB and Mongoose ODM

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Future Enhancements](#future-enhancements)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **ID Generation**: nanoid
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
│   │   │   └── env.ts             # Environment variables configuration
│   │   ├── controllers/
│   │   │   └── shorten.controller.ts  # Business logic for URL operations
│   │   ├── middlewares/
│   │   │   └── error.middleware.ts    # Error handling middleware
│   │   ├── models/
│   │   │   └── Url.model.ts       # Mongoose schema and model
│   │   ├── routes/
│   │   │   └── shorten.routes.ts  # API route definitions
│   │   ├── schema/
│   │   │   └── shorten.schema.ts  # Zod validation schemas
│   │   ├── utils/
│   │   │   └── generateShortCode.ts  # Short code generation utility
│   │   └── index.ts               # Application entry point
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
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

   Create a `.env` file in the `server` directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   CLIENT_ORIGIN=*
   BASE_URL=http://localhost:5000
   ```

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

| Variable        | Description                  | Default                 |
| --------------- | ---------------------------- | ----------------------- |
| `PORT`          | Server port number           | `5000`                  |
| `MONGODB_URI`   | MongoDB connection string    | Required                |
| `CLIENT_ORIGIN` | Allowed CORS origin          | `*`                     |
| `BASE_URL`      | Base URL for the application | `http://localhost:5000` |

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

## 🚀 Future Enhancements

### Immediate Improvements

1. **Custom Short Codes**

   - Allow users to specify custom short codes instead of auto-generated ones
   - Validate custom codes for availability and format

2. **Expiration Dates**

   - Add optional expiration dates for shortened URLs
   - Implement automatic cleanup of expired URLs
   - Background job to remove expired links

3. **Testing Suite**

   - Unit tests for utility functions
   - Integration tests for API endpoints
   - E2E tests for complete workflows
   - Use Jest or Mocha with Supertest

4. **Rate Limiting**

   - Implement rate limiting to prevent abuse
   - Use express-rate-limit or similar middleware
   - Different limits for different endpoints

5. **Authentication & Authorization**
   - User registration and login
   - JWT-based authentication
   - User-specific URL management
   - Admin dashboard for monitoring

### Medium-term Enhancements

6. **Analytics Dashboard**

   - Track click timestamps
   - Geographic location tracking (IP-based)
   - Referrer tracking
   - Device and browser analytics
   - Visual charts and graphs

7. **QR Code Generation**

   - Generate QR codes for shortened URLs
   - Customizable QR code styling
   - Download QR codes in various formats

8. **Bulk Operations**

   - Batch URL creation
   - Export URL statistics
   - CSV/Excel import and export

9. **URL Validation & Security**

   - Check URLs against malware/phishing databases
   - Implement URL preview functionality
   - Add CAPTCHA for public endpoints
   - Blacklist malicious domains

10. **Caching Layer**
    - Implement Redis for caching frequently accessed URLs
    - Reduce database load
    - Improve response times

### Long-term Vision

11. **Frontend Dashboard**

    - React or Vue.js-based admin panel
    - Real-time analytics
    - URL management interface
    - User profile management

12. **API Documentation**

    - Swagger/OpenAPI documentation
    - Interactive API explorer
    - SDK generation for multiple languages

13. **Microservices Architecture**

    - Separate analytics service
    - Dedicated redirect service
    - Queue-based background jobs
    - Message broker integration (RabbitMQ/Kafka)

14. **Advanced Features**

    - A/B testing support
    - Link rotation
    - Password-protected links
    - Link scheduling (activate/deactivate at specific times)
    - Branded short domains

15. **Scalability & Performance**

    - Load balancing
    - Database sharding
    - CDN integration
    - Horizontal scaling support
    - Monitoring and alerting (Prometheus, Grafana)

16. **Mobile Application**
    - Native iOS and Android apps
    - React Native or Flutter implementation
    - QR code scanning
    - Offline mode support

## 🐛 Known Issues & Recommendations

### Current Recommendations

1. **Route Conflict**: The stats endpoint (`/:shortCode/stats`) should be defined before the generic `/:shortCode` route to avoid conflicts. Consider restructuring routes.

2. **Environment Validation**: Add validation to ensure all required environment variables are present at startup.

3. **Error Messages**: Provide more descriptive error messages to clients for better debugging.

4. **Logging**: Enhance logging with different levels (info, warn, error) and consider using Winston or Pino.

5. **Database Indexes**: Ensure proper indexes are set on frequently queried fields (already done for `shortCode`).

6. **Input Sanitization**: Add additional input sanitization beyond URL validation.

7. **CORS Configuration**: Make CORS configuration more restrictive in production.

8. **Documentation**: Add JSDoc comments to functions and interfaces.

9. **Health Check Enhancement**: Include database connection status in health check endpoint.

10. **Graceful Shutdown**: Implement graceful shutdown handling for the server and database connections.

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

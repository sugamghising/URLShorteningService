# URL Shortener - Frontend

A modern, responsive React frontend for the URL Shortener application built with TypeScript and Tailwind CSS.

## 🎨 Features

- **Modern UI/UX**: Clean and intuitive interface built with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback on URL creation and actions
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Click Tracking**: View statistics for each shortened URL
- **Type-Safe**: Built with TypeScript for better development experience
- **Error Handling**: Comprehensive error messages and validation

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Application header with branding
│   │   ├── Footer.tsx       # Application footer
│   │   ├── UrlForm.tsx      # URL shortening form
│   │   ├── UrlCard.tsx      # Display shortened URL with actions
│   │   └── Stats.tsx        # Statistics dashboard
│   ├── services/            # API services
│   │   └── api.service.ts   # Backend API integration
│   ├── types/               # TypeScript type definitions
│   │   └── url.types.ts     # URL-related types and interfaces
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Helper functions (formatting, validation)
│   ├── hooks/               # Custom React hooks (for future use)
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles with Tailwind
├── .env                     # Environment variables
├── .env.example             # Environment template
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see `/server` directory)

### Installation

1. **Navigate to the client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file (use `.env.example` as template):

   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**

   The app will be available at `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## 🎨 Tailwind CSS Setup

The project uses Tailwind CSS for styling with custom configurations:

### Custom Colors

- Primary: Blue color palette (50-900)
- Gradient backgrounds
- Custom hover states

### Configuration

See `tailwind.config.js` for full configuration including:

- Content paths
- Theme extensions
- Custom color palette

## 📦 Components Overview

### Header

- Application branding and logo
- GitHub link
- Responsive navigation

### UrlForm

- Input validation
- Loading states
- Error handling
- Success feedback

### UrlCard

- Display original and shortened URLs
- Copy to clipboard functionality
- Click statistics
- Collapsible detailed stats
- Delete action

### Stats

- Total URLs count
- Total clicks count
- Visual statistics cards

### Footer

- Copyright information
- Navigation links
- Built with credits

## 🔧 Services

### API Service (`api.service.ts`)

Handles all backend communication:

```typescript
- createShortUrl(url: string): Promise<UrlData>
- getUrlByShortCode(shortCode: string): Promise<UrlData>
- getUrlStats(shortCode: string): Promise<UrlData>
- updateUrl(shortCode: string, url: string): Promise<UrlData>
- deleteUrl(shortCode: string): Promise<void>
```

## 🛡️ Type Safety

### Type Definitions (`url.types.ts`)

```typescript
interface UrlData {
  _id: string;
  url: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiError {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}
```

## 🧰 Utility Functions (`helpers.ts`)

- `formatDate(dateString: string)` - Format timestamps
- `copyToClipboard(text: string)` - Copy text to clipboard
- `isValidUrl(url: string)` - Validate URL format
- `getShortUrl(shortCode: string)` - Generate full short URL
- `formatNumber(num: number)` - Format numbers with commas

## 🎯 Features in Detail

### URL Shortening Flow

1. User enters long URL
2. Validation checks URL format
3. API call to backend
4. Display shortened URL
5. Add to local list
6. Show success message

### Error Handling

- Input validation errors
- API error responses
- Network errors
- Rate limiting messages
- User-friendly error messages

### Copy to Clipboard

- One-click copy button
- Visual feedback on success
- Fallback for unsupported browsers

### Statistics Display

- Real-time click tracking
- Detailed stats in expandable view
- Created and updated timestamps
- Total clicks counter

## 🎨 Styling Approach

### Tailwind Utility Classes

- Responsive design with breakpoints
- Hover and focus states
- Gradient backgrounds
- Custom shadows and transitions

### Color Scheme

- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Neutral: Gray palette

## 🚀 Production Build

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)

   - Deploy the `build` folder
   - Configure environment variables
   - Set up custom domain

2. **Docker**

   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY . .
   RUN npm run build
   CMD ["npx", "serve", "-s", "build"]
   ```

3. **AWS S3 + CloudFront**
   - Upload `build` folder to S3
   - Configure CloudFront distribution
   - Set up SSL certificate

## 🔒 Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🐛 Known Issues & Solutions

### Issue: Tailwind classes not applying

**Solution**: Ensure PostCSS and Tailwind are properly configured, and `npm start` is run after changes.

### Issue: CORS errors

**Solution**: Ensure backend CORS is configured to allow the frontend origin.

### Issue: Environment variables not loading

**Solution**: Prefix all variables with `REACT_APP_` and restart dev server.

## 🚧 Future Enhancements

- [ ] User authentication
- [ ] QR code generation
- [ ] Custom short codes
- [ ] URL analytics dashboard
- [ ] Bulk URL import
- [ ] Export functionality
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] i18n (internationalization)

## 📝 Contributing

1. Follow the existing code style
2. Use TypeScript types
3. Write meaningful commit messages
4. Test responsive design
5. Update documentation

## 📄 License

This project is licensed under the ISC License.

---

**Built with React, TypeScript, and Tailwind CSS** ❤️

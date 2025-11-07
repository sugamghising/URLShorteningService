import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UrlForm from "./components/UrlForm";
import UrlCard from "./components/UrlCard";
import Stats from "./components/Stats";
import { UrlData } from "./types/url.types";
import apiService from "./services/api.service";

function App() {
  const [urls, setUrls] = useState<UrlData[]>([]);

  const handleUrlCreated = (newUrl: UrlData) => {
    setUrls([newUrl, ...urls]);
  };

  const handleDeleteUrl = async (shortCode: string) => {
    try {
      await apiService.deleteUrl(shortCode);
      setUrls(urls.filter((url) => url.shortCode !== shortCode));
    } catch (error) {
      console.error("Failed to delete URL:", error);
      alert("Failed to delete URL. Please try again.");
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.accessCount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Simplify Your Links
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create short, memorable links in seconds. Track clicks and share
            with ease.
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
                  onDelete={handleDeleteUrl}
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

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16 mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why Use Our URL Shortener?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Generate short links instantly with our optimized backend
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Track Clicks
              </h4>
              <p className="text-gray-600">
                Monitor how many times your links are accessed
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Secure & Reliable
              </h4>
              <p className="text-gray-600">
                Your data is safe with our enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

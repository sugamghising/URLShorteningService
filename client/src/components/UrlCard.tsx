import React, { useState } from "react";
import { UrlData } from "../types/url.types";
import {
  copyToClipboard,
  formatDate,
  formatNumber,
  getShortUrl,
} from "../utils/helpers";

interface UrlCardProps {
  urlData: UrlData;
  onDelete?: (shortCode: string) => void;
}

const UrlCard: React.FC<UrlCardProps> = ({ urlData, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const shortUrl = getShortUrl(urlData.shortCode);

  const handleCopy = async () => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this short URL?")) {
      onDelete?.(urlData.shortCode);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 mb-4">
      <div className="space-y-4">
        {/* Original URL */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Original URL
          </label>
          <p className="text-gray-800 mt-1 break-all">{urlData.url}</p>
        </div>

        {/* Short URL */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Short URL
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium break-all flex-1"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-3 py-2 rounded-lg transition-colors ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-800">
                {formatNumber(urlData.accessCount)}
              </span>{" "}
              clicks
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              Created {formatDate(urlData.createdAt)}
            </span>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showStats ? "Hide" : "Show"} Details
          </button>
        </div>

        {/* Detailed Stats (Collapsible) */}
        {showStats && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Short Code:</span>
                <span className="ml-2 text-gray-800 font-mono">
                  {urlData.shortCode}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Total Clicks:</span>
                <span className="ml-2 text-gray-800">
                  {formatNumber(urlData.accessCount)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created:</span>
                <span className="ml-2 text-gray-800">
                  {formatDate(urlData.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Last Updated:</span>
                <span className="ml-2 text-gray-800">
                  {formatDate(urlData.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {onDelete && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlCard;

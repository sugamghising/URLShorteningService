import React, { useState } from "react";
import { copyToClipboard } from "../utils/helpers";

interface SecretKeyAlertProps {
  secretKey: string;
  onClose: () => void;
}

const SecretKeyAlert: React.FC<SecretKeyAlertProps> = ({
  secretKey,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(secretKey);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Save Your Secret Key
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This key lets you update or delete this URL later.{" "}
              <strong>Copy it now</strong> — you won't see it again!
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 break-all font-mono text-sm border border-gray-200">
              {secretKey}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCopy}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copied ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Copied!
                  </span>
                ) : (
                  "Copy Key"
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                I've Saved It
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretKeyAlert;

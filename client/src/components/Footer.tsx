import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © {currentYear} URL Shortener. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => console.log("About clicked")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              About
            </button>
            <button
              onClick={() => console.log("Privacy clicked")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Privacy
            </button>
            <button
              onClick={() => console.log("Terms clicked")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Terms
            </button>
            <button
              onClick={() => console.log("Contact clicked")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Contact
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

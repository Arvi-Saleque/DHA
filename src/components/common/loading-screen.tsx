"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with animation */}
        <div className="relative mb-8">
          {/* Rotating border */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-cyan-500 border-r-blue-500 rounded-full animate-spin"></div>
          
          {/* Logo */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-2xl p-6 animate-scale-pulse">
            <img 
              src="/images/logo.png" 
              alt="Loading..." 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 animate-pulse">Welcome to</p>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Darul Hikmah Academy...
          </h2>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-progress"></div>
      </div>
    </div>
  );
}

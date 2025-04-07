"use client";

import { useEffect, useRef } from "react";

const LoadingVisual = () => {

  return (
      <div className="fixed bottom-24 left-0 right-0 flex justify-center">
        <div className="bg-gray-800 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg border border-gray-700">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-sm text-gray-300">Thinking...</span>
        </div>
      </div>
    )
}

export default LoadingVisual;
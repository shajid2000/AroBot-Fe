"use client";

import LoadingVisual from "@/components/LoadingVisual";
import Output from "@/components/Output";
import TextArea from "@/components/TextArea";
import { type ChatOutput } from "@/types";
import { useState } from "react";

export default function Home() {
  const [outputs, setOutputs] = useState<ChatOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div
      className={`container pt-10 pb-32 min-h-screen ${
        outputs.length === 0 && "flex items-center justify-center"
      }`}
    >
      <div className="w-full">
        {outputs.length === 0 && (
          <h1 className="text-4xl text-center mb-5">
            What do you want to know?
          </h1>
        )}

        <TextArea
          setIsGenerating={setIsGenerating}
          isGenerating={isGenerating}
          outputs={outputs}
          setOutputs={setOutputs}
        />

        {outputs.map((output, i) => {
          return <Output key={i} output={output} />;
        })}

      {/* Enhanced skeleton loading for the latest output when isGenerating is true */}
      {isGenerating && outputs.length > 0 && (
        <div className="mb-16">
          <div className="border-t border-gray-700 py-6">
            {/* Insert the loading visual at the position where the response will appear */}
            <LoadingVisual />
            
            {/* Enhanced skeleton loading */}
            <div className="mt-2 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" style={{ animationDelay: "100ms" }}></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" style={{ animationDelay: "200ms" }}></div>
            </div>
            
            {/* Steps skeleton with improved animation */}
            <div className="border border-gray-700 rounded mt-5 p-3 mb-5 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-4 animate-pulse"></div>
              </div>
              
              {/* Animated progress bar */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500">
                <div className="h-full w-20 bg-blue-400 animate-progressBar"></div>
              </div>
            </div>
            
            {/* Tools used skeleton */}
            <div className="flex items-baseline mt-5 gap-1">
              <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-14 animate-pulse" style={{ animationDelay: "150ms" }}></div>
              <div className="h-4 bg-gray-800 rounded w-20 animate-pulse" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      )}
        
      </div>
    </div>
  );
}

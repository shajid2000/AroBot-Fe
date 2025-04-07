"use client";

import { useEffect, useRef, useState } from "react";
import { ChatOutput } from "@/types";
import LoadingVisual from "@/components/LoadingVisual";

const TextArea = ({
  setIsGenerating,
  isGenerating,
  setOutputs,
  outputs,
}: {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  setOutputs: React.Dispatch<React.SetStateAction<ChatOutput[]>>;
  outputs: ChatOutput[];
}) => {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Handles form submission
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(text);
    setText("");
  }

  // Sends message to the api and handles non-streaming response
  const sendMessage = async (text: string) => {

    const newOutputs = [
      ...outputs,
      {
        question: text,
        steps: [],
        result: {
          answer: "",
          tools_used: [],
        },
      },
    ];

    setOutputs(newOutputs);
    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}AI/invoke/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        throw new Error("Error");
      }

      // Parse the JSON response
      const data = await res.json();
      
      // Transform the steps format to match your existing UI components
      const formattedSteps = data.steps.map((step: any) => ({
        name: step.tool_name,
        result: step.tool_args || {},
        output: step.tool_output || ""
      }));
      
      // Update the output with the complete response
      setOutputs((prevState) => {
        const lastOutput = prevState[prevState.length - 1];
        return [
          ...prevState.slice(0, -1),
          {
            ...lastOutput,
            steps: formattedSteps,
            result: {
              answer: data.answer,
              tools_used: data.tools_used,
            },
          },
        ];
      });
    } catch (error) {
      console.error(error);
      // Show error in UI
      setOutputs((prevState) => {
        const lastOutput = prevState[prevState.length - 1];
        return [
          ...prevState.slice(0, -1),
          {
            ...lastOutput,
            result: {
              answer: "Sorry, there was an error processing your request. Please try again.",
              tools_used: [],
            },
          },
        ];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit form when Enter is pressed (without Shift)
  function submitOnEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.code === "Enter" && !e.shiftKey) {
      submit(e);
    }
  }

  // Dynamically adjust textarea height based on content
  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  // Adjust height whenever text content changes
  useEffect(() => {
    adjustHeight();
  }, [text]);

  // Add resize event listener to adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>

{isGenerating && outputs.length > 0 && (
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
      )}


      {/* Main form */}
      <form
        onSubmit={submit}
        className={`flex gap-3 z-10 ${
          outputs.length > 0 ? "fixed bottom-0 left-0 right-0 container pb-5" : ""
        }`}
      >
        <div className="w-full flex items-center bg-gray-800 rounded border border-gray-600 transition-all shadow-lg">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => submitOnEnter(e)}
            rows={1}
            className="w-full p-3 bg-transparent min-h-20 focus:outline-none resize-none"
            placeholder="Ask a question..."
            disabled={isGenerating}
          />

          <button
            type="submit"
            disabled={isGenerating || !text}
            className="disabled:bg-gray-500 bg-[#09BDE1] transition-colors w-9 h-9 rounded-full shrink-0 flex items-center justify-center mr-2"
          >
            {isGenerating ? <LoadingIcon /> : <ArrowIcon />}
          </button>
        </div>
      </form>
    </>
  );
};

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-right"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const LoadingIcon = () => (
  <svg 
    className="animate-spin" 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default TextArea;
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Step, type ChatOutput } from "@/types";
import { useEffect, useState } from "react";

const Output = ({ output }: { output: ChatOutput }) => {


  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", 
    });
  }, [output]);

  const detailsHidden = !!output.result?.answer;
  return (
    <div className="border-t border-gray-700 py-10 first-of-type:pt-0 first-of-type:border-t-0">
      <p className="text-3xl">{output.question}</p>
      {/* Steps */}
      {output.steps.length > 0 && (
        <GenerationSteps steps={output.steps} done={detailsHidden} />
      )}
      {/* Output */}
      <div
        className="mt-5 prose dark:prose-invert min-w-full prose-pre:whitespace-pre-wrap"
        style={{
          overflowWrap: "anywhere",
        }}
      >
        <MarkdownRenderer content={output.result?.answer || ""} />
      </div>
      {/* Tools */}
      {output.result?.tools_used?.length > 0 && (
        <div className="flex items-baseline mt-5 gap-1">
          <p className="text-xs text-gray-500">Tools used:</p>
          <div className="flex flex-wrap items-center gap-1">
            {output.result.tools_used.map((tool, i) => (
              <p
                key={i}
                className="text-xs px-1 py-[1px] bg-gray-800 rounded text-white"
              >
                {tool}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GenerationSteps = ({ steps, done }: { steps: Step[]; done: boolean }) => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (done) setHidden(true);
  }, [done]);
  
  // Helper function to display tool output in a more readable format
  const formatToolOutput = (output: string) => {
    try {
      // Check if it's a JSON string
      if (output.startsWith('[') || output.startsWith('{')) {
        const parsed = JSON.parse(output);
        return JSON.stringify(parsed, null, 2);
      }
      return output;
    } catch (e) {
      return output;
    }
  };
  
  return (
    <div className="border border-gray-700 rounded mt-5 p-3 flex flex-col">
      <button
        className="w-full text-left flex items-center justify-between"
        onClick={() => setHidden(!hidden)}
      >
        Steps {hidden ? <ChevronDown /> : <ChevronUp />}
      </button>
      {!hidden && (
        <div className="flex gap-2 mt-2">
          <div className="pt-2 flex flex-col items-center shrink-0">
            <span
              className={`inline-block w-3 h-3 transition-colors rounded-full ${
                !done ? "animate-pulse bg-emerald-400" : "bg-gray-500"
              }`}
            ></span>
            <div className="w-[1px] grow border-l border-gray-700"></div>
          </div>
          <div className="space-y-2.5 w-full">
            {steps.map((step, j) => {
              return (
                <div key={j} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center">
                    <p className="font-medium text-blue-400">{step.name}</p>
                    {step.name === "final_answer" && (
                      <span className="ml-2 text-xs bg-green-800 text-green-200 px-1.5 py-0.5 rounded">Final</span>
                    )}
                  </div>
                  
                  {/* Arguments section */}
                  {Object.keys(step.result).length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Arguments:</p>
                      <div className="bg-gray-800 p-2 rounded text-sm">
                        {Object.entries(step.result).map(([key, value]) => (
                          <div key={key} className="mb-1 last:mb-0">
                            <span className="text-gray-300">{key}:</span> <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Output section - for non-streaming, we need to add this */}
                  {step.output && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Output:</p>
                      <pre className="bg-gray-800 p-2 rounded text-sm whitespace-pre-wrap break-words">
                        {formatToolOutput(step.output)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-down"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-up"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export default Output;
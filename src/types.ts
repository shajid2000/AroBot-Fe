// types.ts
export interface Step {
  name: string;
  result: Record<string, any>;
  output?: string; // New field for tool output
}

export interface ChatOutput {
  question: string;
  steps: Step[];
  result: {
    answer: string;
    tools_used: string[];
  };
}
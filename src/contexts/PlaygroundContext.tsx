
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { renderTemplate, validateJSON } from "@/utils/template";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PlaygroundContextType {
  template: string;
  setTemplate: (template: string) => void;
  jsonInput: string;
  setJsonInput: (jsonInput: string) => void;
  renderedOutput: string;
  jsonError: string | null;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  clearAll: () => void;
  clearOutput: () => void;
}

export const DEFAULT_TEMPLATE = `# Hello {{ user.name }}!

{% if user.is_premium %}
Thank you for being a premium user!
{% else %}
Consider upgrading to premium.
{% endif %}

Your items:
{% for item in items %}
- {{ item.name }}: {{ item.description }}
{% endfor %}

Your score: {{ score }}/100
`;

export const DEFAULT_JSON = `{
  "user": {
    "name": "John Doe",
    "is_premium": true
  },
  "items": [
    {
      "name": "Item 1",
      "description": "This is the first item"
    },
    {
      "name": "Item 2",
      "description": "This is the second item"
    }
  ],
  "score": 85
}`;

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [renderedOutput, setRenderedOutput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const result = validateJSON(jsonInput);
      
      if ('error' in result) {
        setJsonError(result.error);
        return;
      }
      
      setJsonError(null);
      const rendered = renderTemplate(template, result.data);
      setRenderedOutput(rendered);
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError('An unknown error occurred');
      }
    }
  }, [template, jsonInput]);

  const clearAll = () => {
    setTemplate("");
    setJsonInput("");
    setMessages([]);
    setRenderedOutput("");
  };

  const clearOutput = () => {
    setMessages([]);
  };

  return (
    <PlaygroundContext.Provider
      value={{
        template,
        setTemplate,
        jsonInput,
        setJsonInput,
        renderedOutput,
        jsonError,
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        clearAll,
        clearOutput
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = () => {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
};

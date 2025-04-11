
import { useState, useEffect } from "react";
import { FileJson, FileText } from "lucide-react";
import Editor from "@/components/Editor";
import PanelHeader from "@/components/PanelHeader";
import OutputPanel from "@/components/OutputPanel";
import { renderTemplate, validateJSON } from "@/utils/template";
import Header from "@/components/Header";
import PromptLibrary from "@/components/PromptLibrary";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_TEMPLATE = `# Hello {{ user.name }}!

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

const DEFAULT_JSON = `{
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

const Playground = () => {
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

  // Function to handle selecting a prompt from the library
  const handleSelectPrompt = (promptContent: string) => {
    setTemplate(promptContent);
  };

  // Function to simulate an AI response
  const simulateResponse = (userMessage: string) => {
    // This would be replaced with a real API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Generate a simple response based on the rendered output
        const response = `I've processed your request: "${userMessage}"\n\nBased on the template, here's my response:\n${renderedOutput}`;
        resolve(response);
      }, 1500);
    });
  };

  // Handle sending a message in the conversation
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages([...messages, userMessage]);
    
    // Simulate loading state
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await simulateResponse(content);
      
      // Add AI message
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="panel h-[400px]">
            <PanelHeader 
              title="Prompt Template" 
              icon={<FileText size={16} />} 
              onCopy={() => template}
              actions={
                <PromptLibrary 
                  onSelectPrompt={handleSelectPrompt}
                  currentTemplate={template}
                />
              }
            />
            <Editor 
              language="handlebars" 
              value={template} 
              onChange={(value) => setTemplate(value || "")}
            />
          </div>
          
          <div className="panel h-[400px]">
            <PanelHeader 
              title="JSON Input" 
              icon={<FileJson size={16} />}
              onCopy={() => jsonInput}
            />
            <Editor 
              language="json" 
              value={jsonInput} 
              onChange={(value) => setJsonInput(value || "")}
            />
          </div>
        </div>
        
        <OutputPanel 
          output={renderedOutput} 
          error={jsonError || undefined} 
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Playground;

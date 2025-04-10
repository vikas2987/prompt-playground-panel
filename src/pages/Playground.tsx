
import { useState, useEffect } from "react";
import { FileJson, FileText } from "lucide-react";
import Editor from "@/components/Editor";
import PanelHeader from "@/components/PanelHeader";
import OutputPanel from "@/components/OutputPanel";
import { renderTemplate, validateJSON } from "@/utils/template";
import Header from "@/components/Header";

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
        
        <OutputPanel output={renderedOutput} error={jsonError || undefined} />
      </main>
    </div>
  );
};

export default Playground;

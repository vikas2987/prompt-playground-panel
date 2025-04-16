import { Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TemplateEditor from "@/components/TemplateEditor";
import JsonEditor from "@/components/JsonEditor";
import OutputPanel from "@/components/OutputPanel";
import { PlaygroundProvider, usePlayground } from "@/contexts/PlaygroundContext";
import { sendMessage } from "@/services/conversationService";
import { type ModelName } from "@/config/modelConfig";

const PlaygroundContent = () => {
  const { 
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
  } = usePlayground();
  const { toast } = useToast();

  const handleClearAll = () => {
    clearAll();
    toast({
      description: "All content cleared",
    });
  };

  const handleSendMessage = async (content: string, model: ModelName) => {
    await sendMessage(content, messages, renderedOutput, setMessages, setIsLoading, model);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            Clear All
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <TemplateEditor template={template} setTemplate={setTemplate} />
          <JsonEditor jsonInput={jsonInput} setJsonInput={setJsonInput} />
        </div>
        
        <OutputPanel 
          output={renderedOutput} 
          error={jsonError || undefined} 
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClear={clearOutput}
        />
      </main>
    </div>
  );
};

const Playground = () => {
  return (
    <PlaygroundProvider>
      <PlaygroundContent />
    </PlaygroundProvider>
  );
};

export default Playground;


import { FileText, Trash2 } from "lucide-react";
import Editor from "@/components/Editor";
import PanelHeader from "@/components/PanelHeader";
import { Button } from "@/components/ui/button";
import PromptLibrary from "@/components/PromptLibrary";
import { useToast } from "@/hooks/use-toast";

interface TemplateEditorProps {
  template: string;
  setTemplate: (template: string) => void;
}

const TemplateEditor = ({ template, setTemplate }: TemplateEditorProps) => {
  const { toast } = useToast();

  const clearTemplate = () => {
    setTemplate("");
    toast({
      description: "Template cleared",
    });
  };

  const handleSelectPrompt = (promptContent: string) => {
    setTemplate(promptContent);
  };

  return (
    <div className="panel h-[400px]">
      <PanelHeader 
        title="Prompt Template" 
        icon={<FileText size={16} />} 
        onCopy={() => template}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearTemplate}
              title="Clear template"
            >
              <Trash2 size={16} />
            </Button>
            <PromptLibrary 
              onSelectPrompt={handleSelectPrompt}
              currentTemplate={template}
            />
          </div>
        }
      />
      <Editor 
        language="handlebars" 
        value={template} 
        onChange={(value) => setTemplate(value || "")}
      />
    </div>
  );
};

export default TemplateEditor;

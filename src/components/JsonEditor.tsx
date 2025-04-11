
import { FileJson, Trash2 } from "lucide-react";
import Editor from "@/components/Editor";
import PanelHeader from "@/components/PanelHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface JsonEditorProps {
  jsonInput: string;
  setJsonInput: (jsonInput: string) => void;
}

const JsonEditor = ({ jsonInput, setJsonInput }: JsonEditorProps) => {
  const { toast } = useToast();

  const clearJsonInput = () => {
    setJsonInput("");
    toast({
      description: "JSON input cleared",
    });
  };

  return (
    <div className="panel h-[400px]">
      <PanelHeader 
        title="JSON Input" 
        icon={<FileJson size={16} />}
        onCopy={() => jsonInput}
        actions={
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearJsonInput}
            title="Clear JSON input"
          >
            <Trash2 size={16} />
          </Button>
        }
      />
      <Editor 
        language="json" 
        value={jsonInput} 
        onChange={(value) => setJsonInput(value || "")}
      />
    </div>
  );
};

export default JsonEditor;

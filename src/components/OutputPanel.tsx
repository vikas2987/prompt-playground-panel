
import { AlertCircle } from 'lucide-react';
import PanelHeader from './PanelHeader';

interface OutputPanelProps {
  output: string;
  error?: string;
}

const OutputPanel = ({ output, error }: OutputPanelProps) => {
  return (
    <div className="panel h-full">
      <PanelHeader 
        title="Rendered Output" 
        onCopy={() => output} 
      />
      
      <div className="p-4">
        {error ? (
          <div className="flex items-start gap-2 p-3 text-destructive bg-destructive/10 rounded-md border border-destructive/30">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          output ? (
            <div className="renderer">{output}</div>
          ) : (
            <div className="text-muted-foreground text-center py-8">
              Enter a template and JSON data to see the rendered output
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OutputPanel;

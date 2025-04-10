
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PanelHeaderProps {
  title: string;
  icon?: ReactNode;
  onCopy?: () => string;
  actions?: ReactNode;
}

const PanelHeader = ({ title, icon, onCopy, actions }: PanelHeaderProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!onCopy) return;
    
    const text = onCopy();
    navigator.clipboard.writeText(text);
    
    setCopied(true);
    toast({
      description: "Copied to clipboard!",
      duration: 2000,
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="panel-header">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        {actions}
        {onCopy && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? (
              <ClipboardCheck size={16} className="text-green-500" />
            ) : (
              <Clipboard size={16} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PanelHeader;

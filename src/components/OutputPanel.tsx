import { MessageSquare, FileText, AlertCircle, Trash2 } from 'lucide-react';
import PanelHeader from './PanelHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConversationPanel from './ConversationPanel';
import { Button } from './ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface OutputPanelProps {
  output: string;
  error?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const OutputPanel = ({ 
  output, 
  error, 
  messages,
  onSendMessage,
  isLoading,
  onClear
}: {
  output: string;
  error?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClear: () => void;
}) => {
  return (
    <div className="panel h-full">
      <PanelHeader 
        title="Output" 
        onCopy={() => output} 
        actions={
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClear}
            title="Clear output"
          >
            <Trash2 size={16} />
          </Button>
        }
      />
      
      <Tabs defaultValue="rendered">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rendered" className="flex items-center gap-2">
              <FileText size={16} />
              Rendered Output
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Conversation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rendered" className="p-4 h-[300px] overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="conversation" className="h-[300px]">
          <ConversationPanel 
            messages={messages}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onClear={onClear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutputPanel;

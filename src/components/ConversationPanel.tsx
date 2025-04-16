
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationPanelProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
  onClear: () => void;
}

const ConversationPanel = ({ onSendMessage, messages, isLoading, onClear }: ConversationPanelProps) => {
  const [messageInput, setMessageInput] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !isLoading) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleClear = () => {
    onClear();
    toast({
      description: "Conversation cleared",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <span className="text-sm font-medium">Conversation</span>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Start a conversation using your prompt template
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } p-3 rounded-lg`}
              >
                <div className="mt-1 shrink-0">
                  {message.role === 'user' ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex gap-2 max-w-[80%] bg-muted p-3 rounded-lg">
              <div className="mt-1 shrink-0">
                <Bot size={18} />
              </div>
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !messageInput.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConversationPanel;

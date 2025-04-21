
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS, DEFAULT_MODEL, type ModelName } from '@/config/modelConfig';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isJson?: boolean;
}

interface ConversationPanelProps {
  onSendMessage: (message: string, model: ModelName) => void;
  messages: Message[];
  isLoading: boolean;
  onClear: () => void;
}

const ConversationPanel = ({ onSendMessage, messages, isLoading, onClear }: ConversationPanelProps) => {
  const [messageInput, setMessageInput] = useState('');
  const [jsonResponseInput, setJsonResponseInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelName>(DEFAULT_MODEL);
  const { toast } = useToast();

  // Check if the last message is a JSON response from the assistant
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isLastMessageJsonResponse = lastMessage?.role === 'assistant' && lastMessage?.isJson;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !isLoading) {
      onSendMessage(messageInput, selectedModel);
      setMessageInput('');
    }
  };

  const handleJsonResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonResponseInput.trim() && !isLoading) {
      const formattedInput = `<|start_header_id|>user<|end_header_id|>\n${jsonResponseInput}\n<|eot_id|>`;
      onSendMessage(formattedInput, selectedModel);
      setJsonResponseInput('');
    }
  };

  const handleClear = () => {
    onClear();
    toast({
      description: "Conversation cleared",
    });
  };

  // Helper function to try to pretty print JSON
  const formatJsonContent = (content: string) => {
    try {
      // Check if the content is a JSON string
      const jsonObj = JSON.parse(content);
      return (
        <pre className="whitespace-pre-wrap overflow-x-auto bg-muted/50 p-2 rounded">
          {JSON.stringify(jsonObj, null, 2)}
        </pre>
      );
    } catch (e) {
      // Return the content as is if it's not valid JSON
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Conversation</span>
          <Select
            value={selectedModel}
            onValueChange={(value: ModelName) => setSelectedModel(value)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AVAILABLE_MODELS.DEEPSEEK}>DeepSeek</SelectItem>
              <SelectItem value={AVAILABLE_MODELS.LLAMA}>Llama</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                {message.isJson ? formatJsonContent(message.content) : <div className="whitespace-pre-wrap">{message.content}</div>}
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

      {isLastMessageJsonResponse && !isLoading ? (
        <form onSubmit={handleJsonResponseSubmit} className="border-t p-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your response to the JSON data..."
              value={jsonResponseInput}
              onChange={(e) => setJsonResponseInput(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" className="w-full" disabled={!jsonResponseInput.trim()}>
              Submit Response
            </Button>
          </div>
        </form>
      ) : (
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
      )}
    </div>
  );
};

export default ConversationPanel;


import React, { useState } from 'react';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { 
  Command, 
  CommandInput, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Database, 
  Plus, 
  Search, 
  Trash, 
  Edit,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock database for prompts
const samplePrompts = [
  { id: '1', name: 'Customer Welcome', content: '# Hello {{ user.name }}!\n\n{% if user.is_premium %}\nThank you for being a premium user!\n{% else %}\nConsider upgrading to premium.\n{% endif %}\n\nYour items:\n{% for item in items %}\n- {{ item.name }}: {{ item.description }}\n{% endfor %}\n\nYour score: {{ score }}/100' },
  { id: '2', name: 'Product Feedback', content: '# Product Feedback from {{ user.name }}\n\nProduct: {{ product.name }}\nRating: {{ feedback.rating }}/5\n\n{% if feedback.rating >= 4 %}\nThank you for your positive feedback!\n{% else %}\nWe\'re sorry to hear you had a less than ideal experience.\n{% endif %}\n\nYour comments: {{ feedback.comments }}' },
  { id: '3', name: 'Order Confirmation', content: '# Order Confirmation\n\nDear {{ customer.name }},\n\nYour order #{{ order.id }} has been confirmed.\n\n{% for item in order.items %}\n- {{ item.quantity }}x {{ item.name }} at ${{ item.price }}\n{% endfor %}\n\nTotal: ${{ order.total }}' }
];

interface PromptLibraryProps {
  onSelectPrompt: (content: string) => void;
  currentTemplate: string;
}

const PromptLibrary: React.FC<PromptLibraryProps> = ({ onSelectPrompt, currentTemplate }) => {
  const [prompts, setPrompts] = useState(samplePrompts);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<{ id: string; name: string; content: string } | null>(null);
  const [newPromptName, setNewPromptName] = useState('');
  
  const { toast } = useToast();

  const filteredPrompts = prompts.filter((prompt) => 
    prompt.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSavePrompt = () => {
    if (isEditing && editingPrompt) {
      // Update existing prompt
      setPrompts(prompts.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, name: newPromptName || p.name } 
          : p
      ));
      toast({
        description: "Prompt updated successfully!",
      });
    } else {
      // Save current template as new prompt
      const newPrompt = {
        id: Date.now().toString(),
        name: newPromptName || `Prompt ${prompts.length + 1}`,
        content: currentTemplate
      };
      setPrompts([...prompts, newPrompt]);
      toast({
        description: "Prompt saved to library!",
      });
    }
    setIsEditing(false);
    setEditingPrompt(null);
    setNewPromptName('');
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast({
      description: "Prompt deleted from library.",
    });
  };

  const startEditPrompt = (prompt: { id: string; name: string; content: string }) => {
    setIsEditing(true);
    setEditingPrompt(prompt);
    setNewPromptName(prompt.name);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingPrompt(null);
    setNewPromptName('');
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Database size={14} />
            Template Library
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72" align="start">
          <Command>
            <CommandInput 
              placeholder="Search templates..." 
              value={search}
              onValueChange={setSearch}
            />
            
            {isEditing ? (
              <div className="p-2">
                <Input
                  placeholder="Prompt name"
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSavePrompt}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setNewPromptName('');
                    setIsEditing(true);
                  }}
                >
                  <Plus size={14} />
                  Save Current Template
                </Button>
              </div>
            )}
            
            <CommandList>
              <CommandEmpty>No templates found.</CommandEmpty>
              <CommandGroup heading="Saved Templates">
                {filteredPrompts.map((prompt) => (
                  <CommandItem
                    key={prompt.id}
                    onSelect={() => {
                      onSelectPrompt(prompt.content);
                      setOpen(false);
                      toast({
                        description: `Loaded template: ${prompt.name}`,
                      });
                    }}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="truncate flex-1">{prompt.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditPrompt(prompt);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon" 
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(prompt.id);
                        }}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PromptLibrary;

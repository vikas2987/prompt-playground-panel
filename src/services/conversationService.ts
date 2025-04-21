
import { fetchLlmData } from "./llmService";
import { type ModelName } from "@/config/modelConfig";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isJson?: boolean;
}

// Helper function to check if string is valid JSON
const isJsonString = (str: string): boolean => {
  try {
    const json = JSON.parse(str);
    return typeof json === 'object' && json !== null;
  } catch (e) {
    return false;
  }
};

export const sendMessage = async (
  content: string,
  messages: Message[],
  renderedOutput: string,
  setMessages: (messages: Message[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  model: ModelName
) => {
  // Check if this is a formatted message (from JSON response workflow)
  const isFormattedInput = content.startsWith('<|start_header_id|>user<|end_header_id|>');
  
  const userMessage: Message = { 
    role: 'user', 
    content: isFormattedInput ? content.split('\n')[1] : content // Extract clean content for display
  };
  
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  
  setIsLoading(true);
  
  try {
    const llmResponse = await fetchLlmData(renderedOutput, updatedMessages, model, isFormattedInput ? content : undefined);
    
    // Detect if response is JSON
    const isJson = isJsonString(llmResponse);
    
    const assistantMessage: Message = { 
      role: 'assistant', 
      content: llmResponse,
      isJson 
    };
    const finalMessages = [...updatedMessages, assistantMessage];
    setMessages(finalMessages);
    setIsLoading(false);
  } catch (error) {
    console.error('Error getting response:', error);
    const errorMessage: Message = { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error processing your request.' 
    };
    const errorMessages = [...updatedMessages, errorMessage];
    setMessages(errorMessages);
    setIsLoading(false);
  }
};

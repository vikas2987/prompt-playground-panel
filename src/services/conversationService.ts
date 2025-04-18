
import { fetchLlmData } from "./llmService";
import { type ModelName } from "@/config/modelConfig";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (
  content: string,
  messages: Message[],
  renderedOutput: string,
  setMessages: (messages: Message[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  model: ModelName
) => {
  const userMessage: Message = { role: 'user', content };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  
  setIsLoading(true);
  
  try {
    const llmResponse = await fetchLlmData(renderedOutput, updatedMessages, model);
    
    const assistantMessage: Message = { role: 'assistant', content: llmResponse };
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

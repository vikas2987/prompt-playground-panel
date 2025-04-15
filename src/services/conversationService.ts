
import { fetchLlmData } from "./llmService";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Handles sending a message and getting a response
 */
export const sendMessage = async (
  content: string,
  messages: Message[],
  renderedOutput: string,
  setMessages: (messages: Message[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const userMessage: Message = { role: 'user', content };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  
  setIsLoading(true);
  
  try {
    const llmResponse = await fetchLlmData(content); // Using the user's message directly as prompt
    
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


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
  setMessages([...messages, userMessage]);
  
  setIsLoading(true);
  
  try {
    // Use the rendered output as the prompt for the LLM
    const llmResponse = await fetchLlmData(renderedOutput);
    
    setTimeout(() => {
      const assistantMessage: Message = { role: 'assistant', content: llmResponse };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsLoading(false);
    }, 500);
  } catch (error) {
    console.error('Error getting response:', error);
    const errorMessage: Message = { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error processing your request.' 
    };
    setMessages(prevMessages => [...prevMessages, errorMessage]);
    setIsLoading(false);
  }
};

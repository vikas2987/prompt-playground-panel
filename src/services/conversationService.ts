
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
  // Update messages with the user's message
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  
  setIsLoading(true);
  
  try {
    // Use the rendered output as the prompt for the LLM
    const llmResponse = await fetchLlmData(renderedOutput);
    
    setTimeout(() => {
      // Create the assistant's response message
      const assistantMessage: Message = { role: 'assistant', content: llmResponse };
      // Update messages with both the user's message and the assistant's response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);
    }, 500);
  } catch (error) {
    console.error('Error getting response:', error);
    const errorMessage: Message = { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error processing your request.' 
    };
    // Update messages with both the user's message and the error message
    const errorMessages = [...updatedMessages, errorMessage];
    setMessages(errorMessages);
    setIsLoading(false);
  }
};


import { getApiDomain } from "../utils/apiConfig";
import { type ModelName } from "@/config/modelConfig";

const formatMessage = (role: 'user' | 'assistant', content: string) => {
  return `<|start_header_id|>${role}<|end_header_id|>${content}<|eot_id|>`;
};

const formatConversationHistory = (messages: { role: 'user' | 'assistant'; content: string }[]) => {
  return messages.map(msg => formatMessage(msg.role, msg.content)).join('\n');
};

export const fetchLlmData = async (
  renderedPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  model: ModelName,
  formattedUserInput?: string
): Promise<string> => {
  try {
    let fullPrompt = renderedPrompt;

    if (messages.length > 0) {
      // If we're using a pre-formatted user input, handle differently
      if (formattedUserInput) {
        const conversationHistory = formatConversationHistory(messages.slice(0, -1));
        const assistantWaiting = `<|start_header_id|>assistant<|end_header_id|>`;
        fullPrompt = `${renderedPrompt}\n${conversationHistory}\n${formattedUserInput}\n${assistantWaiting}`;
      } else {
        const conversationHistory = formatConversationHistory(messages.slice(0, -1));
        const currentQuery = formatMessage('user', messages[messages.length - 1].content);
        const assistantWaiting = `<|start_header_id|>assistant<|end_header_id|>`;
        fullPrompt = `${renderedPrompt}\n${conversationHistory}\n${currentQuery}\n${assistantWaiting}`;
      }
      
      // Append </think> for deepseek-r1 model only
      if (model === 'deepseek-r1') {
        fullPrompt += '</think>';
      }
    } else {
      fullPrompt = `${formatMessage('user', renderedPrompt)}\n<|start_header_id|>assistant<|end_header_id|>`;
      // Append </think> for deepseek-r1 model only
      if (model === 'deepseek-r1') {
        fullPrompt += '</think>';
      }
    }

    const apiDomain = getApiDomain();
    const response = await fetch(`${apiDomain}/inference/model/${model}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sso_token_enc_iv': 'your-sso-token-here'
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        max_gen_len: 5000,
        top_p: 0.3,
        temperature: 0.01
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.generation || 'No response received';
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
};

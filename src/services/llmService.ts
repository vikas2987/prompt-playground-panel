
/**
 * Formats a message with header tags
 */
const formatMessage = (role: 'user' | 'assistant', content: string) => {
  return `<|start_header_id|>${role}<|end_header_id|>${content}<|eot_id|>`;
};

/**
 * Formats the conversation history into a single prompt
 */
const formatConversationHistory = (messages: { role: 'user' | 'assistant'; content: string }[]) => {
  return messages.map(msg => formatMessage(msg.role, msg.content)).join('\n');
};

/**
 * Fetches a response from the custom LLM API
 */
export const fetchLlmData = async (
  renderedPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  try {
    // Start with the rendered prompt if it's the first message
    let fullPrompt = renderedPrompt;

    // Add conversation history if there are previous messages
    if (messages.length > 0) {
      // Format and add the conversation history
      const conversationHistory = formatConversationHistory(messages.slice(0, -1));
      
      // Add the current query with user tag
      const currentQuery = formatMessage('user', messages[messages.length - 1].content);
      
      // Add assistant waiting tag for the response
      const assistantWaiting = `<|start_header_id|>assistant<|end_header_id|>`;
      
      // Combine all parts
      fullPrompt = `${renderedPrompt}\n${conversationHistory}\n${currentQuery}\n${assistantWaiting}`;
    } else {
      // For first message, just wrap with tags
      fullPrompt = `${formatMessage('user', renderedPrompt)}\n<|start_header_id|>assistant<|end_header_id|>`;
    }

    const response = await fetch('http://cst-inference-service-staging.staging.svc.cluster.local.k8s-staging-svc.nonprod.paytmdgt.io/model/deepseek-r1/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    return data.response || 'No response received';
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
};


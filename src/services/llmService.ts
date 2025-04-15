
/**
 * Fetches a response from the custom LLM API
 * @param prompt The prompt to send to the LLM
 * @returns The LLM response
 */
export const fetchLlmData = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('http://cst-inference-service-staging.staging.svc.cluster.local.k8s-staging-svc.nonprod.paytmdgt.io/model/deepseek-r1/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
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



import nunjucks from 'nunjucks';

// Initialize nunjucks
const env = new nunjucks.Environment();

/**
 * Renders a template string with the provided context
 * @param template The Jinja/Nunjucks template string
 * @param context The context object to render the template with
 * @returns The rendered template string
 */
export function renderTemplate(template: string, context: object): string {
  try {
    return env.renderString(template, context);
  } catch (error) {
    if (error instanceof Error) {
      return `Error rendering template: ${error.message}`;
    }
    return 'An unknown error occurred';
  }
}

/**
 * Validates JSON string
 * @param jsonString The JSON string to validate
 * @returns An object with error message if invalid, or the parsed JSON if valid
 */
export function validateJSON(jsonString: string): { error: string } | { data: object } {
  if (!jsonString.trim()) {
    return { error: 'JSON is empty' };
  }
  
  try {
    const data = JSON.parse(jsonString);
    if (typeof data !== 'object' || data === null) {
      return { error: 'JSON must be an object' };
    }
    return { data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Invalid JSON' };
  }
}

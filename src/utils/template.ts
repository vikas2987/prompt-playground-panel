
import nunjucks from 'nunjucks';

// Initialize nunjucks with safer configurations
const env = new nunjucks.Environment(null, {
  autoescape: true,  // This might be causing the HTML encoding
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true
});

// Add custom filters
env.addFilter('tojson', function(obj) {
  // Return raw JSON string without HTML encoding
  return new nunjucks.runtime.SafeString(JSON.stringify(obj, null, 2));
});

/**
 * Renders a template string with the provided context
 * @param template The Jinja/Nunjucks template string
 * @param context The context object to render the template with
 * @returns The rendered template string
 */
export function renderTemplate(template: string, context: object): string {
  if (!template.trim()) {
    return '';
  }
  
  try {
    // Pre-process the template to check for unclosed comment blocks
    const processedTemplate = validateComments(template);
    return env.renderString(processedTemplate, context);
  } catch (error) {
    if (error instanceof Error) {
      return `Error rendering template: ${error.message}`;
    }
    return 'An unknown error occurred';
  }
}

/**
 * Validates and fixes comment blocks in a template
 * @param template The template string to validate
 * @returns The processed template string
 */
function validateComments(template: string): string {
  // Check for unclosed comment blocks
  const commentStart = '{#';
  const commentEnd = '#}';
  
  let result = template;
  let startIndex = 0;
  
  while ((startIndex = result.indexOf(commentStart, startIndex)) !== -1) {
    const endIndex = result.indexOf(commentEnd, startIndex + commentStart.length);
    
    if (endIndex === -1) {
      // Found an opening comment without a closing tag
      // Add the closing tag at the end of the line or at the end of the template
      const lineEndIndex = result.indexOf('\n', startIndex);
      if (lineEndIndex !== -1) {
        // Insert comment end before the line end
        result = result.substring(0, lineEndIndex) + commentEnd + result.substring(lineEndIndex);
      } else {
        // Append to the end of template
        result += commentEnd;
      }
    }
    
    // Move past this comment
    startIndex = (endIndex !== -1) ? endIndex + commentEnd.length : result.length;
  }
  
  return result;
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


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, FileJson, Code, Terminal } from "lucide-react";

const About = () => {
  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mb-4">About Jinja Forge Studio</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to effectively use Jinja Forge Studio to test and preview your AI prompts
        </p>
      </div>

      <div className="space-y-8">
        <section className="panel">
          <div className="panel-header">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Code size={20} />
              Jinja Template Syntax
            </h2>
          </div>
          <div className="p-6">
            <p className="mb-4">
              Jinja is a template language that allows you to generate dynamic text. Here are some common syntax examples:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-mono text-sm font-semibold mb-2">Variables</h3>
                <pre className="font-mono text-sm">Hello, {'{{ name }}'}!</pre>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-mono text-sm font-semibold mb-2">Expressions</h3>
                <pre className="font-mono text-sm">{'{{ user.name }}\'s score is {{ score * 10 }}'}</pre>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-mono text-sm font-semibold mb-2">Conditionals</h3>
                <pre className="font-mono text-sm">
                  {'{% if is_premium %}'}
                  {'\n  Thank you for being a premium user!\n'}
                  {'{% else %}'}
                  {'\n  Consider upgrading to premium.\n'}
                  {'{% endif %}'}
                </pre>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-mono text-sm font-semibold mb-2">Loops</h3>
                <pre className="font-mono text-sm">
                  {'{% for item in items %}'}
                  {'\n  - {{ item.name }}: {{ item.description }}\n'}
                  {'{% endfor %}'}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileJson size={20} />
              JSON Input Structure
            </h2>
          </div>
          <div className="p-6">
            <p className="mb-4">
              Your JSON data will be passed to the Jinja template. Here's a sample structure:
            </p>
            <div className="p-4 bg-muted rounded-md">
              <pre className="font-mono text-sm">
{`{
  "user": {
    "name": "John Doe",
    "role": "Developer",
    "is_premium": true
  },
  "items": [
    {
      "name": "Item 1",
      "description": "Description for item 1"
    },
    {
      "name": "Item 2", 
      "description": "Description for item 2"
    }
  ],
  "score": 85
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Terminal size={20} />
              Common Issues & Quick Fixes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Invalid JSON Data</h3>
                <p className="text-muted-foreground">
                  Ensure your JSON is correctly formatted with double quotes around keys and proper comma usage.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Missing Variables</h3>
                <p className="text-muted-foreground">
                  If your template references a variable that doesn't exist in your JSON, it will render as an empty string.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Template Syntax Errors</h3>
                <p className="text-muted-foreground">
                  Check that your control structures (if, for, etc.) are properly closed and formatted.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/playground">Go to Playground</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
          <Code size={32} className="text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Paytm Prompt Playground
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Test and preview AI prompts by dynamically rendering Jinja templates with JSON input.
          A developer-friendly environment optimized for prompt engineering.
        </p>
        
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center mt-4">
          <Button asChild size="lg" className="font-medium">
            <Link to="/playground">Try it now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-medium">
            <Link to="/about">Learn more</Link>
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
          <h2 className="font-semibold text-lg mb-3">How to use Paytm Prompt Playground</h2>
          <ol className="text-left space-y-2 list-decimal list-inside">
            <li>Paste your prompt template in the left editor</li>
            <li>Enter your JSON data in the right editor</li>
            <li>View the rendered result in real-time below</li>
            <li>Copy the rendered output with a single click</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Code, Sun, Moon, Info } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Code size={20} className="text-primary" />
            <span>Prompt Playground</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/playground">Playground</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/about" className="flex items-center gap-1">
              <Info size={16} />
              <span>Help</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

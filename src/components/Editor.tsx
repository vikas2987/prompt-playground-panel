
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useTheme } from '@/hooks/use-theme';

interface EditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

const Editor = ({ language, value, onChange, height = "100%" }: EditorProps) => {
  const { theme } = useTheme();
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className="editor-container">
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={editorTheme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default Editor;

import { useMemo } from "react";
import { CodeBlock } from "./CodeBlock";

type MarkdownRendererProps = {
  content: string;
};

/**
 * Enhanced Markdown renderer with code block support
 * Parses markdown and renders code blocks with syntax highlighting
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parsedContent = useMemo(() => {
    const parts: JSX.Element[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index);
        parts.push(
          <div key={`text-${key++}`} className="markdown-content">
            {renderSimpleMarkdown(textContent)}
          </div>
        );
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      parts.push(<CodeBlock key={`code-${key++}`} language={language} code={code} />);

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex);
      parts.push(
        <div key={`text-${key++}`} className="markdown-content">
          {renderSimpleMarkdown(textContent)}
        </div>
      );
    }

    return parts.length > 0 ? parts : [
      <div key="content" className="markdown-content">
        {renderSimpleMarkdown(content)}
      </div>
    ];
  }, [content]);

  return <div className="prose prose-sm dark:prose-invert max-w-none">{parsedContent}</div>;
}

/**
 * Renders simple markdown elements (bold, italic, links, lists, etc.)
 */
function renderSimpleMarkdown(text: string): JSX.Element[] {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let inList = false;
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="my-2 space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={`h3-${key++}`} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={`h2-${key++}`} className="text-xl font-bold mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={`h1-${key++}`} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>);
    }
    // Lists
    else if (line.match(/^[\*\-\+]\s/)) {
      inList = true;
      listItems.push(line.slice(2));
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s/)) {
      inList = true;
      listItems.push(line.replace(/^\d+\.\s/, ""));
    }
    // Blockquotes
    else if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote key={`quote-${key++}`} className="border-l-4 border-primary/30 pl-4 italic my-2">
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line.match(/^[\-\*\_]{3,}$/)) {
      flushList();
      elements.push(<hr key={`hr-${key++}`} className="my-4 border-border" />);
    }
    // Regular paragraph
    else if (line.trim()) {
      if (inList) {
        flushList();
        inList = false;
      }
      elements.push(
        <p key={`p-${key++}`} className="my-2">
          {renderInlineMarkdown(line)}
        </p>
      );
    }
    // Empty line
    else {
      if (inList) {
        flushList();
        inList = false;
      }
    }
  });

  flushList();
  return elements;
}

/**
 * Renders inline markdown (bold, italic, code, links)
 */
function renderInlineMarkdown(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let key = 0;

  // Inline code
  remaining = remaining.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `__CODE_${key}__`;
    parts.push(<code key={`code-${key++}`} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">{code}</code>);
    return placeholder;
  });

  // Bold
  remaining = remaining.replace(/\*\*([^*]+)\*\*/g, (_, text) => {
    const placeholder = `__BOLD_${key}__`;
    parts.push(<strong key={`bold-${key++}`}>{text}</strong>);
    return placeholder;
  });

  // Italic
  remaining = remaining.replace(/\*([^*]+)\*/g, (_, text) => {
    const placeholder = `__ITALIC_${key}__`;
    parts.push(<em key={`italic-${key++}`}>{text}</em>);
    return placeholder;
  });

  // Links
  remaining = remaining.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const placeholder = `__LINK_${key}__`;
    parts.push(
      <a key={`link-${key++}`} href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
        {text}
      </a>
    );
    return placeholder;
  });

  // Reconstruct the string with React elements
  const result: (string | JSX.Element)[] = [];
  const placeholderRegex = /__(?:CODE|BOLD|ITALIC|LINK)_(\d+)__/g;
  let lastIndex = 0;
  let match;

  while ((match = placeholderRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      result.push(remaining.slice(lastIndex, match.index));
    }
    const index = parseInt(match[1]);
    result.push(parts[index]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < remaining.length) {
    result.push(remaining.slice(lastIndex));
  }

  return result.length > 0 ? result : [remaining];
}

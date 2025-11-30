import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Sparkles, Copy, RefreshCw, Edit2, Check, ThumbsUp, ThumbsDown, StopCircle, Download, FileJson, FileText, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

/**
 * Message type matching server-side LLM Message interface
 */
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatBoxProps = {
  /**
   * Messages array to display in the chat.
   * Should match the format used by invokeLLM on the server.
   */
  messages: Message[];

  /**
   * Callback when user sends a message.
   * Typically you'll call a tRPC mutation here to invoke the LLM.
   */
  onSendMessage: (content: string) => void;

  /**
   * Whether the AI is currently generating a response
   */
  isLoading?: boolean;

  /**
   * Optional callback to stop the AI generation
   */
  onStop?: () => void;

  /**
   * Placeholder text for the input field
   */
  placeholder?: string;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Height of the chat box (default: 600px)
   */
  height?: string | number;

  /**
   * Empty state message to display when no messages
   */
  emptyStateMessage?: string;

  /**
   * Suggested prompts to display in empty state
   * Click to send directly
   */
  suggestedPrompts?: string[];

  /**
   * Suggested follow-up questions to display after AI responses
   * These are context-aware suggestions based on the conversation
   */
  suggestedFollowUps?: string[];
};

/**
 * A ready-to-use AI chat box component that integrates with the LLM system.
 *
 * Features:
 * - Matches server-side Message interface for seamless integration
 * - Markdown rendering with Streamdown
 * - Auto-scrolls to latest message
 * - Loading states
 * - Uses global theme colors from index.css
 *
 * @example
 * ```tsx
 * const ChatPage = () => {
 *   const [messages, setMessages] = useState<Message[]>([
 *     { role: "system", content: "You are a helpful assistant." }
 *   ]);
 *
 *   const chatMutation = trpc.ai.chat.useMutation({
 *     onSuccess: (response) => {
 *       // Assuming your tRPC endpoint returns the AI response as a string
 *       setMessages(prev => [...prev, {
 *         role: "assistant",
 *         content: response
 *       }]);
 *     },
 *     onError: (error) => {
 *       console.error("Chat error:", error);
 *       // Optionally show error message to user
 *     }
 *   });
 *
 *   const handleSend = (content: string) => {
 *     const newMessages = [...messages, { role: "user", content }];
 *     setMessages(newMessages);
 *     chatMutation.mutate({ messages: newMessages });
 *   };
 *
 *   return (
 *     <AIChatBox
 *       messages={messages}
 *       onSendMessage={handleSend}
 *       isLoading={chatMutation.isPending}
 *       suggestedPrompts={[
 *         "Explain quantum computing",
 *         "Write a hello world in Python"
 *       ]}
 *     />
 *   );
 * };
 * ```
 */
export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  onStop,
  placeholder = "Type your message...",
  className,
  height = "600px",
  emptyStateMessage = "Start a conversation with AI",
  suggestedPrompts,
  suggestedFollowUps,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter out system messages
  const displayMessages = messages.filter((msg) => msg.role !== "system");

  // Copy message handler
  const handleCopyMessage = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Export handlers
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      messages: displayMessages,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(jsonString, `chat-export-${timestamp}.json`, "application/json");
  };

  const handleExportMarkdown = () => {
    let markdown = `# محادثة رقيم AI\n\n`;
    markdown += `تاريخ التصدير: ${new Date().toLocaleString("ar-SA")}\n\n---\n\n`;

    displayMessages.forEach((message, index) => {
      const role = message.role === "user" ? "👤 المستخدم" : "🤖 رقيم AI";
      markdown += `## ${role}\n\n${message.content}\n\n---\n\n`;
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(markdown, `chat-export-${timestamp}.md`, "text/markdown");
  };

  // Calculate min-height for last assistant message to push user message to top
  const [minHeightForLastMessage, setMinHeightForLastMessage] = useState(0);

  useEffect(() => {
    if (containerRef.current && inputAreaRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const inputHeight = inputAreaRef.current.offsetHeight;
      const scrollAreaHeight = containerHeight - inputHeight;

      // Reserve space for:
      // - padding (p-4 = 32px top+bottom)
      // - user message: 40px (item height) + 16px (margin-top from space-y-4) = 56px
      // Note: margin-bottom is not counted because it naturally pushes the assistant message down
      const userMessageReservedHeight = 56;
      const calculatedHeight = scrollAreaHeight - 32 - userMessageReservedHeight;

      setMinHeightForLastMessage(Math.max(0, calculatedHeight));
    }
  }, []);

  // Scroll to bottom helper function with smooth animation
  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    onSendMessage(trimmedInput);
    setInput("");

    // Scroll immediately after sending
    scrollToBottom();

    // Keep focus on input
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col bg-card text-card-foreground rounded-lg border shadow-sm",
        className
      )}
      style={{ height }}
    >
      {/* Header with Export Menu */}
      {displayMessages.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">محادثة رقيم AI</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
                <FileJson className="w-4 h-4 ml-2" />
                تصدير كـ JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMarkdown} className="cursor-pointer">
                <FileText className="w-4 h-4 ml-2" />
                تصدير كـ Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
                <Download className="w-3 h-3 ml-2" />
                {displayMessages.length} رسالة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Messages Area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden">
        {displayMessages.length === 0 ? (
          <div className="flex h-full flex-col p-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="size-12 opacity-20" />
                <p className="text-sm">{emptyStateMessage}</p>
              </div>

              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-4 p-4">
              {displayMessages.map((message, index) => {
                // Apply min-height to last message only if NOT loading (when loading, the loading indicator gets it)
                const isLastMessage = index === displayMessages.length - 1;
                const shouldApplyMinHeight =
                  isLastMessage && !isLoading && minHeightForLastMessage > 0;

                return (
                  <div
                    key={index}
                    className="group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className={cn(
                        "flex gap-3",
                        message.role === "user"
                          ? "justify-end items-start"
                          : "justify-start items-start"
                      )}
                      style={
                        shouldApplyMinHeight
                          ? { minHeight: `${minHeightForLastMessage}px` }
                          : undefined
                      }
                    >
                      {message.role === "assistant" && (
                        <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="size-4 text-primary" />
                        </div>
                      )}

                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2.5",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {message.role === "assistant" ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            <p className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {hoveredIndex === index && (
                          <div className={cn(
                            "flex gap-1 px-1 animate-in fade-in slide-in-from-top-1 duration-200",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}>
                            <button
                              onClick={() => handleCopyMessage(message.content, index)}
                              className="p-1.5 rounded hover:bg-accent transition-colors"
                              title="نسخ"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </button>
                            {message.role === "assistant" && (
                              <>
                                <button
                                  className="p-1.5 rounded hover:bg-accent transition-colors"
                                  title="إعادة التوليد"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  className="p-1.5 rounded hover:bg-accent transition-colors"
                                  title="إعجاب"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  className="p-1.5 rounded hover:bg-accent transition-colors"
                                  title="عدم إعجاب"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                              </>
                            )}
                            {message.role === "user" && (
                              <button
                                className="p-1.5 rounded hover:bg-accent transition-colors"
                                title="تعديل"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="size-8 shrink-0 mt-1 rounded-full bg-secondary flex items-center justify-center">
                          <User className="size-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Suggested Follow-ups */}
              {!isLoading && suggestedFollowUps && suggestedFollowUps.length > 0 && displayMessages.length > 0 && (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    أسئلة مقترحة للمتابعة:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {suggestedFollowUps.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onSendMessage(suggestion)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div
                  className="flex items-start gap-3"
                  style={
                    minHeightForLastMessage > 0
                      ? { minHeight: `${minHeightForLastMessage}px` }
                      : undefined
                  }
                >
                  <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-lg bg-muted px-4 py-2.5 flex items-center gap-1.5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-xs text-muted-foreground mr-2">رقيم AI يكتب...</span>
                    </div>
                    {onStop && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onStop}
                        className="self-start h-7 px-3 gap-1.5 text-xs border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                        إيقاف التوليد
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/50">
        {/* Input hints bar */}
        {input.trim() && !isLoading && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2 text-xs text-muted-foreground border-b border-border/50">
            <Sparkles className="w-3 h-3" />
            <span>اضغط Enter للإرسال • Shift+Enter لسطر جديد • {input.length} حرف</span>
          </div>
        )}

        <form
          ref={inputAreaRef}
          onSubmit={handleSubmit}
          className="flex gap-2 p-4 items-end"
        >
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full max-h-32 resize-none min-h-10 pr-12"
              rows={1}
            />
            {input.length > 0 && (
              <div className="absolute left-2 bottom-2 flex items-center gap-1">
                <span className={cn(
                  "text-xs transition-colors",
                  input.length > 2000 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {input.length}
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0 h-10 w-10 transition-all hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

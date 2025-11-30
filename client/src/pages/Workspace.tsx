import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageSquare, Sparkles, Wand2, Folder, AppWindow, BarChart } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ProviderValue = "openai" | "anthropic" | "gemini" | "deepseek" | "forge";

const modelOptions = [
  { value: "auto", label: "Auto (router)" },
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "anthropic", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "forge", label: "Forge" },
];

const apps = [
  { label: "Prompt Builder", href: "/library" },
  { label: "Gemini Banana", href: "/analyzer" },
  { label: "Worksheets", href: "/worksheets" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "History", href: "/history" },
];

function ChatPanel({
  messages,
  onSend,
  isSending,
  selectedModel,
  onModelChange,
}: {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  isSending: boolean;
  selectedModel: string;
  onModelChange: (value: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Unified Chat
        </CardTitle>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Model</label>
          <select
            value={selectedModel}
            onChange={e => onModelChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {modelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-3 border rounded p-3 bg-muted/30">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground">No messages yet. Start a conversation.</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask or paste context..."
            className="min-h-[80px]"
          />
          <Button onClick={handleSend} disabled={isSending} className="self-end min-w-[110px]">
            {isSending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Workspace() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
  const [selectedSessionId, setSelectedSessionId] = useState<number | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState<string>("auto");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const projectsQuery = trpc.projects.list.useQuery();
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => projectsQuery.refetch(),
  });

  const sessionsQuery = trpc.sessions.list.useQuery(
    { projectId: selectedProjectId },
    { enabled: true }
  );
  const createSession = trpc.sessions.create.useMutation({
    onSuccess: () => sessionsQuery.refetch(),
  });
  const renameSession = trpc.sessions.rename.useMutation({
    onSuccess: () => sessionsQuery.refetch(),
  });

  const templatesQuery = trpc.templates.list.useQuery();
  const usageQuery = trpc.analytics.usage.useQuery();
  const chatMutation = trpc.chat.send.useMutation();

  useEffect(() => {
    if (!projectsQuery.data || projectsQuery.data.length === 0) return;
    if (!selectedProjectId) {
      setSelectedProjectId(projectsQuery.data[0].id);
    }
  }, [projectsQuery.data, selectedProjectId]);

  useEffect(() => {
    if (!sessionsQuery.data || sessionsQuery.data.length === 0) return;
    if (!selectedSessionId) {
      setSelectedSessionId(sessionsQuery.data[0].id);
    }
  }, [sessionsQuery.data, selectedSessionId]);

  const handleCreateProject = async () => {
    const name = prompt("Project name?") || "New Project";
    await createProject.mutateAsync({ name });
  };

  const handleCreateSession = async () => {
    const title = prompt("Session title?") || "New Session";
    await createSession.mutateAsync({ projectId: selectedProjectId, title });
  };

  const handleSend = async (content: string) => {
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    const provider: ProviderValue | undefined =
      selectedModel === "auto" ? undefined : (selectedModel as ProviderValue);
    const result = await chatMutation.mutateAsync({
      messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
      projectId: selectedProjectId,
      sessionId: selectedSessionId,
      provider,
      model: provider ? undefined : undefined,
    });

    const reply =
      typeof result.response.choices[0]?.message?.content === "string"
        ? result.response.choices[0].message.content
        : JSON.stringify(result.response.choices[0]?.message?.content ?? "");

    setMessages([...nextMessages, { role: "assistant", content: reply }]);
    if (selectedSessionId) {
      await renameSession.mutateAsync({
        id: selectedSessionId,
        title: selectedSession?.title || `Session ${selectedSessionId}`,
      });
    }
  };

  const selectedProject = useMemo(
    () => projectsQuery.data?.find(p => p.id === selectedProjectId),
    [projectsQuery.data, selectedProjectId]
  );

  const selectedSession = useMemo(
    () => sessionsQuery.data?.find(s => s.id === selectedSessionId),
    [sessionsQuery.data, selectedSessionId]
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-muted-foreground tracking-wide">AI Operating System</div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Unified Workspace
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateProject} disabled={createProject.isLoading}>
            New Project
          </Button>
          <Button onClick={handleCreateSession} disabled={createSession.isLoading}>
            New Session
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr_260px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" /> Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projectsQuery.data?.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setSelectedSessionId(undefined);
                  }}
                  className={`w-full text-left px-3 py-2 rounded border text-sm ${
                    project.id === selectedProjectId ? "border-primary bg-primary/10" : "border-muted"
                  }`}
                >
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-xs text-muted-foreground">{project.description}</div>
                  )}
                </button>
              ))}
              {projectsQuery.data?.length === 0 && (
                <div className="text-sm text-muted-foreground">Create your first project.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" /> Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {templatesQuery.data?.slice(0, 5).map(template => (
                <div
                  key={template.id}
                  className="border rounded px-3 py-2 text-sm flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">{template.title}</div>
                    <div className="text-xs text-muted-foreground">{template.category}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const content = typeof template.content === "string" ? template.content : "";
                      const current = messages[messages.length - 1]?.content || "";
                      // prefill chat input by copying to clipboard-like prompt
                      navigator.clipboard?.writeText(content).catch(() => undefined);
                      alert("Template copied to clipboard. Paste into the chat.");
                    }}
                  >
                    Use
                  </Button>
                </div>
              ))}
              {!templatesQuery.data?.length && (
                <div className="text-sm text-muted-foreground">No templates yet.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AppWindow className="h-5 w-5" /> Apps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {apps.map(app => (
                <a
                  key={app.href}
                  href={app.href}
                  className="block px-3 py-2 rounded border hover:bg-muted text-sm"
                >
                  {app.label}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{selectedProject?.name || "No project"}</Badge>
            <Badge variant="secondary">{selectedSession?.title || "No session"}</Badge>
          </div>
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isSending={chatMutation.isLoading}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" /> Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Total calls</span>
                <span>{usageQuery.data?.totalCalls ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total cost (est.)</span>
                <span>${(usageQuery.data?.totalCostUsd ?? 0).toFixed(4)}</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">By model</div>
                {usageQuery.data?.byModel?.map(item => (
                  <div key={`${item.provider}-${item.model}`} className="flex justify-between">
                    <span>
                      {item.provider} / {item.model}
                    </span>
                    <span className="text-muted-foreground">
                      {item.calls} calls • ${item.costUsd.toFixed(4)}
                    </span>
                  </div>
                ))}
                {!usageQuery.data?.byModel?.length && (
                  <div className="text-sm text-muted-foreground">No usage yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

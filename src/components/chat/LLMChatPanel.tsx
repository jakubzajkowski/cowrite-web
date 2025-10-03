import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { ChatMessage } from '@/lib/api/chat';
import { streamMockLLMResponse } from '@/lib/api/chat';
import { Bot, MessageSquare, X, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LLMChatPanelProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

let idCounter = 0;
const nextId = () => `${Date.now()}_${idCounter++}`;

export const LLMChatPanel = ({ open, onClose, className }: LLMChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // Sentinel element at the end of the messages list for reliable auto-scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userManuallyScrolledRef = useRef(false);

  // Track manual scroll position to avoid forcing scroll when user is reading older messages
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const threshold = 80;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      userManuallyScrolledRef.current = !atBottom;
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          role: 'assistant',
          content: 'Cześć! Jestem Twoim asystentem pisania. Jak mogę pomóc?',
          createdAt: new Date(),
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    // Auto-scroll only if user hasn't scrolled up
    if (!userManuallyScrolledRef.current) {
      bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
    }
  }, [messages, isStreaming]);

  const sendMessage = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || isStreaming) return;
    setInput('');
    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const assistantId = nextId();
    const assistantBase: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, assistantBase]);
    setIsStreaming(true);
    abortRef.current = new AbortController();
    try {
      for await (const token of streamMockLLMResponse()) {
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, content: m.content + token } : m))
        );
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + '\n[Wystąpił błąd strumienia]' } : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
  };

  return (
    <div
      className={cn(
        'fixed top-14 right-0 z-40 h-[calc(100vh-3.5rem)] w-[380px] md:w-[420px] border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg flex flex-col transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4 text-primary" /> AI Chat
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 rounded text-primary">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isStreaming && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={stopStreaming}
              title="Zatrzymaj"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4 max-h-full overflow-y-auto" ref={containerRef}>
            {messages.map(m => (
              <div
                key={m.id}
                className={cn(
                  'text-sm flex gap-2 group',
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {m.role === 'assistant' && (
                  <div className="shrink-0 mt-1">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-md px-3 py-2 leading-relaxed shadow-sm whitespace-pre-wrap break-words',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  )}
                >
                  {m.content ||
                    (m.role === 'assistant' ? (
                      <span className="text-muted-foreground">...</span>
                    ) : null)}
                </div>
              </div>
            ))}
            {messages.length === 0 && !isStreaming && (
              <div className="text-xs text-center text-muted-foreground pt-8">
                Zacznij rozmowę — zapytaj o podsumowanie, pomysły lub korektę stylu.
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <Separator />
        <form
          className="p-3 flex flex-col gap-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="flex items-start gap-2">
            <Input
              placeholder="Zadaj pytanie..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="h-9 w-9"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] text-muted-foreground">
              Enter wysyła • Shift+Enter nowa linia • Ctrl+Shift+C toggle
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="h-7 px-2 text-[11px] gap-1"
              onClick={() => {
                setInput(prev =>
                  prev ? prev + '\n' : 'Przeredaguj ten akapit aby był bardziej zwięzły.'
                );
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Przykład
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

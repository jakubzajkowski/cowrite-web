import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, X, Sparkles, Plus, Loader2, Send, FileText, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useCreateConversation } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import { MarkdownMessage } from './MarkdownMessage';
import { FileAttachmentButton } from './FileAttachmentButton';

interface AttachedFile {
  id: string;
  name: string;
  type?: string;
  size?: number;
  content?: string;
}

interface LLMChatPanelProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const LLMChatPanel = ({ open, onClose, className }: LLMChatPanelProps) => {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const createConversation = useCreateConversation();
  const { connected, messages, isLoading, sendMessage, clearMessages } = useChat({
    conversationId: currentConversationId,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateNewChat = () => {
    createConversation.mutate(
      { title: `Chat ${new Date().toLocaleString('en-US')}` },
      {
        onSuccess: data => {
          setCurrentConversationId(data.id);
          clearMessages();
          setAttachedFiles([]);
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentConversationId) return;

    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDetachFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFilesChosen = (files: File[]) => {
    const now = Date.now();
    const additions: AttachedFile[] = files.map(f => ({
      id: `${f.name}-${f.size}-${now}`,
      name: f.name,
      type: f.type,
      size: f.size,
    }));
    setAttachedFiles(prev => [...prev, ...additions]);
  };

  return (
    <div
      className={cn(
        'fixed top-14 right-0 z-40 h-[calc(100vh-3.5rem)] w-[380px] md:w-[420px] border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg flex flex-col transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4 text-primary" />
          AI Chat
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 rounded text-primary">
            Beta
          </span>
          {connected && (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCreateNewChat}
            disabled={createConversation.isPending}
            title="New chat"
          >
            {createConversation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="p-4 space-y-4 min-h-full">
            {!currentConversationId ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="rounded-full bg-primary/10 p-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Welcome to AI Chat!</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    Start a new conversation to chat with your AI assistant
                  </p>
                </div>
                <Button
                  onClick={handleCreateNewChat}
                  disabled={createConversation.isPending}
                  className="gap-2"
                >
                  {createConversation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  New Chat
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Ask a question to start the conversation
                </p>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 text-sm animate-in fade-in-50 slide-in-from-bottom-2 duration-300',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 max-w-[85%] break-words',
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <MarkdownMessage content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <span className="text-[10px] opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 text-sm animate-in fade-in-50">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <form onSubmit={handleSubmit} className="p-3 flex flex-col gap-2">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {attachedFiles.map(file => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-xs"
                >
                  <FileText className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDetachFile(file.id)}
                    className="hover:text-destructive transition-colors"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <FileAttachmentButton
              onFilesChosen={handleFilesChosen}
              disabled={!currentConversationId || isLoading}
              count={attachedFiles.length}
              accept="*/*"
            />
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentConversationId ? 'Ask a question...' : 'Create a new chat first'}
              className="flex-1"
              disabled={!currentConversationId || isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9"
              disabled={!currentConversationId || !inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] text-muted-foreground">
              Enter to send • Shift+Enter for new line
            </div>
            {currentConversationId && (
              <div className="text-[10px] text-muted-foreground">ID: {currentConversationId}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

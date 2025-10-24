'use client';

import { useEffect, useRef } from 'react';
import type { Message } from './chat-layout';
import ChatMessage from './chat-message';
import { Bot } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted p-3 shadow-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-200" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

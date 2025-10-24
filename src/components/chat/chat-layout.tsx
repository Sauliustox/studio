'use client';

import { useState, useEffect } from 'react';
import { sendMessage } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useTranslation } from 'react-i18next';

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs only on the client, after the component has mounted.
    setIsClient(true);
    setSessionId(crypto.randomUUID());
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'agent',
        text: t('chat.initialMessage'),
      },
    ]);
  }, [t]);


  const handleSend = async (text: string) => {
    if (isLoading || !text.trim() || !sessionId) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await sendMessage(sessionId, text);
      let agentText: string;
      if (result.error) {
        agentText = t(result.error, { ns: 'common', defaultValue: "Įvyko klaida." });
      } else if (!result.text) {
        agentText = t('error.emptyAnswer');
      } else {
        agentText = result.text;
      }
      const agentMessage: Message = { id: crypto.randomUUID(), sender: 'agent', text: agentText };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (e) {
      const errorMessage: Message = { id: crypto.randomUUID(), sender: 'agent', text: t('error.processingError') };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center rounded-xl border bg-card shadow-2xl shadow-primary/10">
        <p>Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-4xl flex-col rounded-xl border bg-card shadow-2xl shadow-primary/10">
      <header className="flex items-center justify-between rounded-t-xl border-b p-4">
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground">{t('chat.title')}</h1>
          <p className="font-normal font-body text-foreground text-sm">{t('chat.subtitle')}</p>
        </div>
        {sessionId && (
            <div className="text-xs text-muted-foreground">
                {t('chat.sessionId')}: <span className="font-mono">{sessionId.substring(0, 8)}...</span>
            </div>
        )}
      </header>
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

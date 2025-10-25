'use client';

import { useState, useEffect } from 'react';
import { sendMessage } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { fallbackLng } from '@/app/i18n/settings';

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

export default function ChatLayout() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const lng = fallbackLng;
  const { t } = useTranslation(lng, 'common');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/login`);
  };

  if (!isClient || loading) {
    return (
      <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center rounded-xl border bg-card shadow-2xl shadow-primary/10">
        <p>{t('chat.loading')}</p>
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
        <div className='flex items-center gap-4'>
          {user ? (
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className='sr-only'>{t('auth.logout')}</span>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/login`}>{t('auth.login.button')}</Link>
            </Button>
          )}
          {sessionId && (
              <div className="text-xs text-muted-foreground">
                  {t('chat.sessionId')}: <span className="font-mono">{sessionId.substring(0, 8)}...</span>
              </div>
          )}
        </div>
      </header>
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

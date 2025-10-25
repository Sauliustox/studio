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
import { useRouter } from 'next/navigation';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSessionId(crypto.randomUUID());
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'agent',
        text: 'Sveiki! Aš esu didelis kalbos modelis, apmokytas Google. Mano pagrindinė funkcija yra padėti jums spręsti ginčus tarp klientų ir draudimo bendrovių, remiantis **Lietuvos banko** išspręstų ginčų dokumentais. Kuo galiu padėti?',
      },
    ]);
  }, []);


  const handleSend = async (text: string) => {
    if (isLoading || !text.trim() || !sessionId) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await sendMessage(sessionId, text);
      let agentText: string;
      if (result.error) {
        agentText = "Atsiprašome, įvyko klaida.";
      } else if (!result.text) {
        agentText = "Atsiprašome, negavau atsakymo.";
      } else {
        agentText = result.text;
      }
      const agentMessage: Message = { id: crypto.randomUUID(), sender: 'agent', text: agentText };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (e) {
      const errorMessage: Message = { id: crypto.randomUUID(), sender: 'agent', text: "Atsiprašome, įvyko apdorojimo klaida." };
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
        <p>Kraunasi...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-4xl flex-col rounded-xl border bg-card shadow-2xl shadow-primary/10">
      <header className="flex items-center justify-between rounded-t-xl border-b p-4">
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground">FinRAGas</h1>
          <p className="font-normal font-body text-foreground text-sm">Išmanus draudimo sprendimų paieškos įrankis</p>
        </div>
        <div className='flex items-center gap-4'>
          {user ? (
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className='sr-only'>Atsijungti</span>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/login`}>Prisijungti</Link>
            </Button>
          )}
          {sessionId && (
              <div className="text-xs text-muted-foreground">
                  Sesijos ID: <span className="font-mono">{sessionId.substring(0, 8)}...</span>
              </div>
          )}
        </div>
      </header>
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

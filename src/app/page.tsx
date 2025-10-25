'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatLayout from '@/components/chat/chat-layout';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
    } else if (!user.emailVerified) {
      router.push('/verify-email');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.emailVerified) {
    return (
      <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
        <p>Kraunasi...</p>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
      <ChatLayout />
    </main>
  );
}

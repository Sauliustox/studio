'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatLayout from '@/components/chat/chat-layout';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
        <p>{t('chat.loading')}</p>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
      <ChatLayout />
    </main>
  );
}

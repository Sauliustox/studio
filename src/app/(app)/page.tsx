'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatLayout from '@/components/chat/chat-layout';
import { useTranslation } from '@/app/i18n/client';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { t } = useTranslation('lt', 'common');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (loading || !isClient) return;

    if (!user) {
      router.push(`/login`);
    } else if (!user.emailVerified) {
      router.push(`/verify-email`);
    }
  }, [user, loading, router, isClient]);

  if (loading || !isClient || !user || !user.emailVerified) {
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

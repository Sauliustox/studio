'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatLayout from '@/components/chat/chat-layout';
import { useTranslation } from '@/app/i18n/client';
import { useI18n } from '@/app/i18n/provider';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'common');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && isClient && lng) {
      if (!user) {
        router.push(`/${lng}/login`);
      } else if (!user.emailVerified) {
        router.push(`/${lng}/verify-email`);
      }
    }
  }, [user, loading, router, lng, isClient]);

  if (loading || !user || !user.emailVerified || !isClient) {
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

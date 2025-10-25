'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ChatLayout from '@/components/chat/chat-layout';
import { useTranslation } from './i18n/client';
import { useI18n } from './i18n/provider';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'common');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/${lng}/login`);
      } else if (!user.emailVerified) {
        router.push(`/${lng}/verify-email`);
      }
    }
  }, [user, loading, router, lng]);

  if (loading || !user || !user.emailVerified) {
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

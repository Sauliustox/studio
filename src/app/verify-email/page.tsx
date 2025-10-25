'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { fallbackLng } from '../i18n/settings';

export default function VerifyEmailPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const lng = fallbackLng;
  const { t } = useTranslation(lng, 'common');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push(`/login`);
    } else if (user.emailVerified) {
      router.push(`/`);
    }
  }, [user, loading, router]);

  const handleResendEmail = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: t('auth.verifyEmail.resendSuccessTitle'),
        description: t('auth.verifyEmail.resendSuccessDescription'),
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('auth.verifyEmail.resendErrorTitle'),
        description: t('auth.verifyEmail.resendErrorDescription'),
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !user || user.emailVerified) {
    return (
      <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
        <p>{t('chat.loading')}</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.verifyEmail.title')}</CardTitle>
          <CardDescription>
            {t('auth.verifyEmail.description', { email: user.email })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t('auth.verifyEmail.instructions')}
          </p>
          <Button onClick={handleResendEmail} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth.verifyEmail.resendButton')}
          </Button>
          <Button variant="outline" onClick={() => auth.signOut().then(() => router.push(`/login`))}>
            {t('auth.logout')}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

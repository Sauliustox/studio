'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

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
        title: "Laiškas išsiųstas",
        description: "Patvirtinimo laiškas buvo sėkmingai išsiųstas.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Klaida",
        description: "Nepavyko išsiųsti patvirtinimo laiško. Bandykite dar kartą.",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !user || user.emailVerified) {
    return (
      <main className="flex h-[100dvh] flex-col items-center justify-center bg-background p-4">
        <p>Kraunasi...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Patvirtinkite savo el. paštą</CardTitle>
          <CardDescription>
            Išsiuntėme patvirtinimo laišką į {user.email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Jei negavote laiško, patikrinkite šlamšto aplanką arba išsiųskite laišką iš naujo.
          </p>
          <Button onClick={handleResendEmail} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Siųsti laišką iš naujo
          </Button>
          <Button variant="outline" onClick={() => auth.signOut().then(() => router.push(`/login`))}>
            Atsijungti
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

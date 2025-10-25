'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Neteisingas el. pašto formatas.' }),
  password: z.string().min(6, { message: 'Slaptažodis turi būti bent 6 simbolių ilgio.' }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#4285F4"
      d="M22.055 12.118c0-.637-.055-1.255-.164-1.855H12v3.491h5.645c-.246 1.127-.973 2.082-2.128 2.809v2.264h2.909c1.702-1.564 2.682-3.873 2.682-6.709z"
    />
    <path
      fill="#34A853"
      d="M12 22.909c2.727 0 5.027-.89 6.709-2.427l-2.909-2.264c-.909.609-2.064.973-3.8 1.009-2.91 0-5.364-1.964-6.245-4.591H2.71v2.336A10.95 10.95 0 0012 22.909z"
    />
    <path
      fill="#FBBC05"
      d="M5.755 14.282c-.136-.41-.218-.846-.218-1.282s.082-.872.218-1.282V9.382H2.71A10.95 10.95 0 001.818 13c0 1.482.382 2.873 1.055 4.109l2.882-2.827z"
    />
    <path
      fill="#EA4335"
      d="M12 5.091c1.473 0 2.8.509 3.836 1.491l2.582-2.582C16.918 2.5 14.618 1.09 12 1.09A10.95 10.95 0 001.818 7.09L4.7 9.382c.882-2.627 3.336-4.591 6.245-4.591l1.055.291z"
    />
  </svg>
);


export default function LoginForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: "Konfigūracijos klaida",
        description: "Firebase nėra sukonfigūruotas.",
      });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      if (!userCredential.user.emailVerified) {
        router.push(`/verify-email`);
        return;
      }
      
      toast({
        title: "Sėkmingai prisijungėte",
      });
      router.push(`/`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Prisijungimo klaida",
        description: "Neteisingas el. paštas arba slaptažodis.",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Konfigūracijos klaida',
            description: 'Firebase nėra sukonfigūruotas.',
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: 'Sėkmingai prisijungėte',
        });
        router.push('/');
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Prisijungimo per Google klaida',
            description: 'Nepavyko prisijungti naudojant Google. Bandykite dar kartą.',
        });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>El. paštas</FormLabel>
                <FormControl>
                  <Input placeholder="jūsų@el.paštas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slaptažodis</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !auth}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Prisijungti
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
            Arba tęskite su
            </span>
        </div>
      </div>
        
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={!auth}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Prisijungti su Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Neturite paskyros? <Link href={`/signup`} className="underline hover:text-primary">Užsiregistruokite</Link>
      </p>
    </div>
  );
}

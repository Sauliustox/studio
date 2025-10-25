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
        <title>Google</title>
        <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.36 1.84-4.48 1.84-5.4 0-9.75-4.35-9.75-9.75s4.35-9.75 9.75-9.75c3.03 0 5.1 1.23 6.24 2.36l-2.6 2.6c-.66-.66-1.56-1.23-3.64-1.23-4.35 0-7.84 3.48-7.84 7.84s3.48 7.84 7.84 7.84c2.6 0 4.1-1.1 4.56-2.92h-4.56v-3.28h7.84z"
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

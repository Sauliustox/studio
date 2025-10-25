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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Neteisingas el. pašto formatas.' }),
  password: z.string().min(6, { message: 'Slaptažodis turi būti bent 6 simbolių ilgio.' }),
});

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <p className="text-center text-sm text-muted-foreground">
          Neturite paskyros? <Link href={`/signup`} className="underline hover:text-primary">Užsiregistruokite</Link>
        </p>
      </form>
    </Form>
  );
}

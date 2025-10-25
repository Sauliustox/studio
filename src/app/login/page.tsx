'use client';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useAuth } from '@/firebase';

export default function LoginPage() {
  const auth = useAuth();

  return (
    <AuthLayout
      title="Prisijungimas"
      description={auth ? "Prisijunkite prie savo paskyros" : "Firebase nėra sukonfigūruotas. Patikrinkite .env.local failą."}
    >
      <LoginForm />
    </AuthLayout>
  );
}

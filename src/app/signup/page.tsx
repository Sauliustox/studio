'use client';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useAuth } from '@/firebase';


export default function SignupPage() {
  const auth = useAuth();
  return (
    <AuthLayout
      title="Registracija"
      description={auth ? "Sukurkite naują paskyrą" : "Firebase nėra sukonfigūruotas. Patikrinkite .env.local failą."}
    >
      <SignupForm />
    </AuthLayout>
  );
}

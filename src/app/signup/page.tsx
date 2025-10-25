'use client';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <AuthLayout
      title="Registracija"
      description="Sukurkite naują paskyrą"
    >
      <SignupForm />
    </AuthLayout>
  );
}

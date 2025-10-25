'use client';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useTranslation } from '@/app/i18n/client';

export default function SignupPage() {
  const { t } = useTranslation('lt', 'common');
  return (
    <AuthLayout
      title={t('auth.signup.title')}
      description={t('auth.signup.description')}
    >
      <SignupForm />
    </AuthLayout>
  );
}

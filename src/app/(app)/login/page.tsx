'use client';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useTranslation } from '@/app/i18n/client';

export default function LoginPage() {
  const { t } = useTranslation('lt', 'common');
  return (
    <AuthLayout
      title={t('auth.login.title')}
      description={t('auth.login.description')}
    >
      <LoginForm />
    </AuthLayout>
  );
}

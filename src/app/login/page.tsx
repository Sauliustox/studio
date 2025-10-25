'use client';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useTranslation } from '@/app/i18n/client';
import { fallbackLng } from '../i18n/settings';

export default function LoginPage() {
  const lng = fallbackLng;
  const { t } = useTranslation(lng, 'common');
  return (
    <AuthLayout
      title={t('auth.login.title')}
      description={t('auth.login.description')}
    >
      <LoginForm />
    </AuthLayout>
  );
}

'use client';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useTranslation } from '../i18n/client';
import { useI18n } from '../i18n/provider';

export default function LoginPage() {
  const { lng } = useI18n();
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

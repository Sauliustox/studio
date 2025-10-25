'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useI18n } from '@/app/i18n/provider';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'common');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="rounded-b-xl border-t bg-background/50 p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder={t('chat.inputPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
          className="flex-1 bg-transparent"
        />
        <Button type="submit" disabled={isLoading || !text.trim()} size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="sr-only">{t('chat.send')}</span>
        </Button>
      </form>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import type { Message } from './chat-layout';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.sender === 'agent';
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        !isAgent && 'flex-row-reverse',
        'animate-in fade-in zoom-in-95'
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={cn(
          isAgent ? 'bg-primary/20 text-primary-foreground' : 'bg-accent text-accent-foreground'
        )}>
          {isAgent ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[80%] rounded-xl p-3 shadow-sm',
          isAgent
            ? 'rounded-tl-none bg-muted'
            : 'rounded-tr-none bg-primary text-primary-foreground',
          'prose prose-sm prose-p:my-0'
        )}
      >
        {isAgent ? (
          <ReactMarkdown
            components={{
              p: (props) => <p className="text-sm leading-relaxed" style={{ overflowWrap: 'break-word' }} {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          <p className="text-sm leading-relaxed" style={{ overflowWrap: 'break-word' }}>{message.text}</p>
        )}
      </div>
    </div>
  );
}

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </main>
    );
}

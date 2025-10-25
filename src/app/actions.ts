'use server';

export async function sendMessage(sessionId: string, chatInput: string): Promise<{ text?: string; error?: string }> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  const bearerToken = process.env.NEXT_PUBLIC_WEBHOOK_AUTH_BEARER_TOKEN;

  if (!webhookUrl || !bearerToken) {
    console.error('Webhook URL or Bearer Token is not configured in environment variables.');
    return { error: 'Serverio konfigūracijos klaida.' };
  }
  
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ sessionId, chatInput }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Webhook error:', res.status, errorText);
      return { error: 'Klaida gaunant atsakymą iš serverio.' };
    }

    const responseText = await res.text();
    if (!responseText) {
        return { error: 'Gautas tuščias atsakymas.' };
    }

    try {
      const data = JSON.parse(responseText);
      const text = data.output;
      if (typeof text !== 'string') {
          return { text: JSON.stringify(data) }
      }
      return { text };
    } catch (e) {
      // If parsing fails, return the raw text. It might be a simple string response.
      return { text: responseText };
    }

  } catch (error) {
    console.error('Error sending message:', error);
    if (error instanceof SyntaxError) {
        return { error: 'Klaida apdorojant atsakymą.' };
    }
    return { error: 'Prisijungimo prie serverio klaida.' };
  }
}

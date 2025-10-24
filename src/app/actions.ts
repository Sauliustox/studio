'use server';

interface AgentResponse {
  output?: string;
}

export async function sendMessage(sessionId: string, chatInput: string): Promise<{ text?: string; error?: string }> {
  const webhookUrl = process.env.WEBHOOK_URL;
  const bearerToken = process.env.WEBHOOK_AUTH_BEARER_TOKEN;

  if (!webhookUrl || !bearerToken) {
    console.error('Webhook URL or Bearer Token is not configured in environment variables.');
    return { error: 'error.serverConfig' };
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
      return { error: 'error.webhookResponseError' };
    }

    const responseText = await res.text();
    if (!responseText) {
        return { error: 'error.emptyResponse' };
    }

    try {
      const data: AgentResponse = JSON.parse(responseText);
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
        return { error: 'error.parsingError' };
    }
    return { error: 'error.connectionError' };
  }
}

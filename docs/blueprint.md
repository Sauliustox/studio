# **App Name**: Webhook Chat

## Core Features:

- Session ID Generation: Generate a random session ID (UUID) upon page load and store it for the user's session.
- User Input: Text input field for users to type their messages.
- API Call: Send a POST request to http://n8n.savaitgalioprojektai.lt/webhook/a3ea6a63-adfa-46d2-83cb-bc05cb95c921 with the message content in the body and the Authorization header (Authorization: Bearer LABAS). Include the sessionId and chatInput in the request body.
- Agent Response Display: Display the agent's response in the chat interface upon receiving it from the webhook.
- Chat History: Display the history of messages sent and received in the current session.

## Style Guidelines:

- Primary color: A soft blue (#A0D2EB) for a calm and inviting feel. This color promotes trust and communication, key aspects of a chat application.
- Background color: A very light, desaturated blue (#F0F8FF), nearly white, to ensure readability and a clean interface.
- Accent color: A gentle violet (#B2BEB5) to highlight interactive elements and unread messages.
- Body and headline font: 'PT Sans', a modern humanist sans-serif font.
- Use simple, outlined icons for common actions like sending messages, clearing the chat, or indicating read/unread status.
- A clean and intuitive layout with the chat input at the bottom and the message history displayed chronologically above.
- Subtle animations when new messages arrive, such as a gentle fade-in effect or a slight movement of the chat bubble.
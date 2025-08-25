import { marked } from 'marked';

const BASE_URL = "http://localhost:8000/api";

export async function sendMessage(message: string): Promise<string> {
    try {
        const response = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch LLM response');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

export async function startWorkflow(
    prompt: string,
    threadId: string,
    onMessage: (message: any) => void,
    onError: (error: string) => void,
    onClose: () => void
) {
    try {
        const response = await fetch(`${BASE_URL}/workflow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt, thread_id: threadId }),
        });

        if (!response.body) {
            onError("Failed to receive stream from server.");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                onClose();
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            while (buffer.includes('\n')) {
                const newlineIndex = buffer.indexOf('\n');
                const line = buffer.substring(0, newlineIndex).trim();
                buffer = buffer.substring(newlineIndex + 1);

                if (line) {
                    try {
                        const event = JSON.parse(line);
                        onMessage(event);
                    } catch (e) {
                        console.error("Failed to parse JSON chunk:", e);
                        onError("Failed to parse server response.");
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error starting workflow stream:", error);
        onError("Failed to connect to backend workflow service.");
    }
}
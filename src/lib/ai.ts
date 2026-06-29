export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendChatMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.choices[0]?.message?.content || '응답을 받지 못했습니다.';
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('AI 응답을 가져오는 중 오류가 발생했습니다.');
  }
}
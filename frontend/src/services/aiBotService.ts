// src/services/aiBotService.ts
export interface BotResponse {
  text: string;
}

export const sendMessageToBot = async (message: string, lang = 'en'): Promise<BotResponse> => {
  try {
    const response = await fetch('http://localhost:5001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, lang }),
    });

    const data = await response.json();
    return { text: data.reply };
  } catch (err) {
    console.error(err);
    return { text: 'Sorry, the bot is not responding at the moment.' };
  }
};

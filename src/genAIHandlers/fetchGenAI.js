// aiHandler.js
import got from 'got';

export async function fetchGenAI(prompt,text) {
  try {
    const response = await got.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_AI_ACCOUNTID}/ai/run/${process.env.CLOUDFLARE_AI_MODEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_AI_TOKEN}`,
          'content-type': 'application/json',
        },
        json: {
          messages: [
            { role: 'system', content: `${process.env.CLOUDFLARE_AI_CONTENT_SYSTEM}` },
            { role: 'user', content: `${prompt} ${text}` },
          ],
        },
      }
    );

    console.log(response.body);
    
    const parsedResponse = JSON.parse(JSON.parse(response.body).result.response);
    return parsedResponse;
  } catch (error) {
    console.error('Error fetching AI:', error);
    return null;
  }
}

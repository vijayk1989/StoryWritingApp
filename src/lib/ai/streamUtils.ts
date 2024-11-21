interface StreamHandlerOptions {
    onContent: (content: string) => void;
    onStatus?: (status: StreamStatus) => void;
}

interface StreamStatus {
    completed: boolean;
    chunks: number;
    length: number;
}

export async function handleAIStream(
    response: Response,
    options: StreamHandlerOptions
): Promise<string> {
    let accumulatedText = '';
    let chunkCount = 0;
    let streamEnded = false;

    if (!response.body) throw new Error('No response body');
    const reader = response.body.getReader();

    console.log('Stream started');

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                streamEnded = true;
                console.log('Stream completed normally');
                break;
            }

            const chunk = new TextDecoder().decode(value);
            chunkCount++;

            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonString = line.slice(6);
                    if (jsonString === '[DONE]') {
                        streamEnded = true;
                        console.log('Received [DONE] signal');
                        continue;
                    }

                    try {
                        const jsonData = JSON.parse(jsonString);
                        const content = jsonData.choices[0]?.delta?.content || '';
                        accumulatedText += content;
                        options.onContent(accumulatedText);
                    } catch (e) {
                        console.error('JSON parsing error');
                    }
                }
            }
        }
    } catch (error) {
        console.error('Stream error:', { error, streamEnded });
        throw error;
    } finally {
        const status: StreamStatus = {
            completed: streamEnded,
            chunks: chunkCount,
            length: accumulatedText.length
        };
        options.onStatus?.(status);
        console.log('Stream status:', status);
    }

    return accumulatedText;
}

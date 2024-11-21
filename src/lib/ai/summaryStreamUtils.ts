interface SummaryStreamOptions {
    onContent: (content: string) => void;
    onStatus?: (status: StreamStatus) => void;
    maxWords?: number;
}

interface StreamStatus {
    completed: boolean;
    chunks: number;
    wordCount: number;
}

export async function handleSummaryStream(
    response: Response,
    options: SummaryStreamOptions
): Promise<string> {
    const MAX_WORDS = options.maxWords || 250;
    let summary = '';
    let wordCount = 0;
    let chunkCount = 0;
    let isDone = false;

    if (!response.body) throw new Error('No response body');
    const reader = response.body.getReader();

    try {
        while (!isDone) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            const chunk = new TextDecoder().decode(value);
            chunkCount++;

            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonString = line.slice(6);

                    if (jsonString === '[DONE]') {
                        isDone = true;
                        break;
                    }

                    try {
                        const jsonData = JSON.parse(jsonString);
                        const content = jsonData.choices[0]?.delta?.content || '';

                        // Count words in new content
                        const newWords = content.trim().split(/\s+/).filter(Boolean).length;

                        // Check if we'll exceed the word limit
                        if (wordCount + newWords > MAX_WORDS) {
                            const words = content.split(/\s+/);
                            const remainingWords = MAX_WORDS - wordCount;
                            const truncatedContent = words.slice(0, remainingWords).join(' ');

                            summary += truncatedContent;
                            wordCount += remainingWords;
                            options.onContent(summary);

                            isDone = true;
                            break;
                        }

                        summary += content;
                        wordCount += newWords;
                        options.onContent(summary);

                    } catch (e) {
                        console.error('JSON parsing error:', e);
                    }
                }
            }

            options.onStatus?.({
                completed: isDone,
                chunks: chunkCount,
                wordCount
            });
        }
    } catch (error) {
        console.error('Summary stream error:', error);
        throw error;
    }

    return summary;
} 
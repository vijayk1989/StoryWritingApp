import { createReactBlockSpec } from '@blocknote/react';
import './styles.css';

// The Scene Beat block.
export const SceneBeat = (sendToBackend: (textData: string) => Promise<Response>) =>
    createReactBlockSpec(
        {
            type: 'sceneBeat',
            propSchema: {},
            content: 'inline',
        },
        {
            render: (props) => {
                const handleGenerateClick = async () => {
                    const block = props.editor.getBlock(props.block.id);
                    if (!block?.content) return;

                    // Get all blocks up to the current scene beat
                    const document = props.editor.document;
                    const currentBlockIndex = document.findIndex(b => b.id === props.block.id);
                    const previousBlocks = document.slice(0, currentBlockIndex);

                    // Collect text from previous blocks, excluding scene beats
                    let previousText = '';
                    previousBlocks.forEach(block => {
                        // Only include text from non-sceneBeat blocks
                        if (block.type !== 'sceneBeat' && block.content && Array.isArray(block.content)) {
                            const blockText = block.content.reduce((acc, item) => {
                                if ('text' in item) {
                                    return acc + item.text;
                                }
                                return acc;
                            }, '');
                            previousText += blockText + '\n';
                        }
                    });

                    // Get the current scene beat's content
                    const currentPrompt = block.content.reduce((acc, item) => {
                        if ('text' in item) {
                            return acc + item.text;
                        }
                        return acc;
                    }, '');

                    // Combine previous text with current prompt
                    const fullPrompt = `${previousText}\n${currentPrompt}`;

                    try {
                        const response = await sendToBackend(fullPrompt);
                        if (!response.body) throw new Error('No response body');

                        // Create a new block after the current one
                        const newBlock = {
                            type: 'paragraph',
                            content: ''
                        };

                        props.editor.insertBlocks([newBlock], props.block.id, 'after');

                        // Get the newly created block's ID
                        const updatedDocument = props.editor.document;
                        const updatedBlockIndex = updatedDocument.findIndex(b => b.id === props.block.id);
                        const newBlockId = updatedDocument[updatedBlockIndex + 1].id;

                        const reader = response.body.getReader();
                        let accumulatedText = '';

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = new TextDecoder().decode(value);
                            const lines = chunk.split('\n').filter(line => line.trim() !== '');

                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const jsonString = line.slice(6);
                                    if (jsonString === '[DONE]') continue;

                                    try {
                                        const jsonData = JSON.parse(jsonString);
                                        const content = jsonData.choices[0]?.delta?.content || '';
                                        accumulatedText += content;

                                        props.editor.updateBlock(newBlockId, {
                                            type: 'paragraph',
                                            content: accumulatedText
                                        });
                                    } catch (e) {
                                        console.error('Error parsing JSON:', e);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error processing stream:', error);
                    }
                };

                return (
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 shadow-sm my-2 min-w-[100%]">
                        <div
                            className="w-full min-h-[24px] flex-grow p-2 rounded bg-white/50 focus:bg-white focus:outline-none transition-colors duration-200"
                            ref={props.contentRef}
                            contentEditable
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleGenerateClick}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-gray-600 
                                         bg-white border border-gray-200 rounded-md 
                                         hover:bg-gray-50 hover:border-gray-300 
                                         transition-all duration-200"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 4V20M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Generate Prose
                            </button>
                        </div>
                    </div>
                );
            },
        }
    );

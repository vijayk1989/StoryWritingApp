import { createReactBlockSpec } from '@blocknote/react';
import { useLorebookStore } from '../store/useLorebookStore';
import { useEffect, useState } from 'react';
import './styles.css';
import { formatPromptMessages } from '../lib/ai/promptUtils';
import { generateCompletion } from '../lib/ai/generation';
import { usePrompts } from '@/hooks/usePrompts';
import { Prompt } from '@/types/prompt';
import { useChapterStore } from '@/store/useChapterStore';
import { handleAIStream } from '../lib/ai/streamUtils';
import { povSettingsDB } from '@/lib/indexedDB';

// The Scene Beat block.
export const SceneBeat = (storyId: string | undefined, chapter_number: number, chapterId: string) =>
    createReactBlockSpec(
        {
            type: 'sceneBeat',
            propSchema: {},
            content: 'inline',
        },
        {
            render: (props) => {
                const { lorebookItems, lorebookItemsByTag } = useLorebookStore()
                const { prompts, systemPrompts } = usePrompts()
                const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
                const [selectedModel, setSelectedModel] = useState<string>('')
                const [summariesSoFar, setSummariesSoFar] = useState<string>('')
                const { getPreviousChapterSummaries } = useChapterStore()

                useEffect(() => {
                    console.log('All lorebook items:', lorebookItems)
                    console.log('Summaries so far:')
                    console.log('Lorebook items by tag:', lorebookItemsByTag)
                }, [lorebookItems, lorebookItemsByTag])

                useEffect(() => {
                    if (storyId && chapter_number) {
                        getPreviousChapterSummaries(storyId, chapter_number)
                            .then(summaries => {
                                setSummariesSoFar(summaries)
                                console.log('Previous chapter summaries in scene beat:', summaries)
                            })
                            .catch(error => {
                                console.error('Error fetching previous chapter summaries:', error)
                            })
                    }
                }, [storyId, chapter_number, getPreviousChapterSummaries])

                const handleGenerateClick = async () => {
                    if (!selectedPrompt || !selectedModel) {
                        console.error('Please select a prompt and model first')
                        return
                    }

                    // Get POV settings first
                    const povSettings = await povSettingsDB.getPOVSettings(chapterId)
                    const povType = povSettings?.pov_type || "Third Person Omniscient"
                    const povCharacter = povSettings?.pov_character || ""

                    // Split the full model path and extract the actual model ID
                    // e.g., "openrouter/microsoft/wizardlm-2-8x22b" -> ["openrouter", "microsoft", "wizardlm-2-8x22b"]
                    const parts = selectedModel.split('/')

                    // For OpenRouter models, we want everything after "openrouter/"
                    // For local models, we keep the original behavior
                    const vendor = parts[0]
                    const modelId = vendor === 'openrouter'
                        ? parts.slice(1).join('/') // Join the rest of the path for OpenRouter models
                        : parts[1] // Just take the model name for other vendors (like local)

                    console.log('Parsed model selection:', {
                        vendor,
                        modelId,
                        fullModel: selectedModel
                    })

                    if (!vendor || !modelId) {
                        throw new Error('Invalid model ID format')
                    }

                    const block = props.editor.getBlock(props.block.id);
                    if (!block?.content) return;

                    // Get previous text
                    const document = props.editor.document;
                    const currentBlockIndex = document.findIndex(b => b.id === props.block.id);
                    const previousBlocks = document.slice(0, currentBlockIndex);
                    const previousText = previousBlocks
                        .filter(block => block.type !== 'sceneBeat')
                        .map(block => {
                            if (!block.content || !Array.isArray(block.content)) return '';
                            return block.content.reduce((acc, item) => {
                                if ('text' in item) return acc + item.text;
                                return acc;
                            }, '');
                        })
                        .join('\n');

                    // Get scene beat content
                    const sceneBeat = block.content.reduce((acc, item) => {
                        if ('text' in item) return acc + item.text;
                        return acc;
                    }, '');

                    // Format prompt using promptUtils with POV data
                    const messages = formatPromptMessages(
                        selectedPrompt.prompt_data,
                        {
                            lorebookItems,
                            summariesSoFar,
                            previousText,
                            sceneBeat,
                            povType,
                            povCharacter
                        }
                    );

                    console.log('Sending prompt to AI:', {
                        model: modelId,
                        messages: messages.map(msg => ({
                            role: msg.role,
                            content: msg.content.slice(0, 100) + (msg.content.length > 100 ? '...' : '') // Truncate long content for readability
                        })),
                        fullMessages: messages // Log full messages if needed
                    });

                    try {
                        const response = await generateCompletion({
                            messages,
                            model: modelId,
                            stream: true,
                            temperature: 0.7,
                            max_tokens: 1000,
                            vendor
                        });

                        const newBlock = { type: 'paragraph', content: '' };
                        const newBlockId = props.editor.insertBlocks([newBlock], props.block.id, 'after')[0];

                        await handleAIStream(response, {
                            onContent: (content) => {
                                props.editor.updateBlock(newBlockId, {
                                    type: 'paragraph',
                                    content
                                });
                            },
                            onStatus: (status) => {
                                console.log('Generation completed:', status);
                            }
                        });
                    } catch (error) {
                        console.error('Generation failed:', error);
                        throw error;
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
                            <select
                                className="px-2 py-1 text-[13px] border rounded"
                                value={selectedPrompt?.id || ''}
                                onChange={(e) => {
                                    const prompt = [...prompts, ...systemPrompts].find(p => p.id === e.target.value)
                                    setSelectedPrompt(prompt || null)
                                    setSelectedModel('')
                                }}
                            >
                                <option value="">Select Prompt</option>
                                <optgroup label="System Prompts">
                                    {systemPrompts.map(prompt => (
                                        <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="User Prompts">
                                    {prompts.map(prompt => (
                                        <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
                                    ))}
                                </optgroup>
                            </select>

                            {selectedPrompt && (
                                <select
                                    className="px-2 py-1 text-[13px] border rounded"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    <option value="">Select Model</option>
                                    {selectedPrompt.allowed_models.split(',').map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            )}

                            <button
                                onClick={handleGenerateClick}
                                disabled={!selectedPrompt || !selectedModel}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-gray-600 
                                         bg-white border border-gray-200 rounded-md 
                                         hover:bg-gray-50 hover:border-gray-300 
                                         disabled:opacity-50 disabled:cursor-not-allowed
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

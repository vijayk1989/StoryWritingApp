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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

// Add this helper function at the top of your component
const getDisplayModelName = (fullPath: string) => {
    const parts = fullPath.trim().split('/');
    return parts[parts.length - 1]; // Get the last part of the path
};

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
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex flex-row gap-2 sm:gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-[200px] truncate">
                                            <span className="truncate">
                                                {selectedPrompt?.name || "Select Prompt"}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        {systemPrompts.length > 0 && (
                                            <>
                                                <DropdownMenuItem disabled className="font-semibold">
                                                    System Prompts
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {systemPrompts.map((prompt) => (
                                                    <DropdownMenuItem
                                                        key={prompt.id}
                                                        onClick={() => {
                                                            setSelectedPrompt(prompt)
                                                            setSelectedModel('')
                                                        }}
                                                    >
                                                        {prompt.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}

                                        {prompts.length > 0 && (
                                            <>
                                                <DropdownMenuItem disabled className="font-semibold">
                                                    User Prompts
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {prompts.map((prompt) => (
                                                    <DropdownMenuItem
                                                        key={prompt.id}
                                                        onClick={() => {
                                                            setSelectedPrompt(prompt)
                                                            setSelectedModel('')
                                                        }}
                                                    >
                                                        {prompt.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {selectedPrompt && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-[200px] truncate">
                                                <span className="truncate">
                                                    {selectedModel ? getDisplayModelName(selectedModel) : "Select Model"}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            {selectedPrompt.allowed_models.split(',').map((model) => (
                                                <DropdownMenuItem
                                                    key={model}
                                                    onClick={() => setSelectedModel(model)}
                                                >
                                                    {getDisplayModelName(model)}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                <Button
                                    onClick={handleGenerateClick}
                                    disabled={!selectedPrompt || !selectedModel}
                                    variant="outline"
                                    className="w-full sm:w-[200px] flex items-center justify-center gap-1.5"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4V20M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="truncate">Generate Prose</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            },
        }
    );

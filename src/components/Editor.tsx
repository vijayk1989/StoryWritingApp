import {
    BlockNoteEditor,
    BlockNoteSchema,
    defaultBlockSpecs,
    filterSuggestionItems,
    insertOrUpdateBlock,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { SceneBeat } from './SceneBeat';
import { useMemo, useState, useEffect } from 'react';
import { useChapter, useChapterStore } from '../store/useChapterStore';
import { useLorebookStore } from '../store/useLorebookStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { POVSelector } from './POVSelector'
import { povSettingsDB } from '@/lib/indexedDB';

const sendToBackend = async (textData: string) => {
    try {
        const response = await fetch('http://localhost:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: textData
                    }
                ],
                stream: true,
                model: 'llama-3.2-3b-instruct',
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Slash menu item to insert an Alert block


interface EditorProps {
    chapterId: string;
}

const Editor = ({ chapterId }: EditorProps) => {
    const { data: chapter, error, isLoading } = useChapter(chapterId)
    const { updateChapter } = useChapterStore()
    const [isSaving, setIsSaving] = useState(false)
    const { getPreviousChapterSummaries } = useChapterStore()

    const memoizedChapter = useMemo(() => chapter, [chapter?.id, chapter?.chapter_data])

    // Get lorebook items for the current story
    const { lorebookItems, lorebookItemsByTag, findItemByTag } = useLorebookStore()

    useEffect(() => {
        console.log('All lorebook items:', lorebookItems)
        console.log('Lorebook items by tag:', lorebookItemsByTag)

        // Example lookups
        const hermioneByName = findItemByTag('Hermione Granger')
        const hermioneByTag = findItemByTag('Hermione')
        console.log('Hermione by name:', hermioneByName)
        console.log('Hermione by tag:', hermioneByTag)
    }, [lorebookItems, lorebookItemsByTag])

    useEffect(() => {
        if (chapter?.story_id && chapter?.chapter_number) {
            getPreviousChapterSummaries(chapter.story_id, chapter.chapter_number)
                .then(summaries => {
                    console.log('Previous chapter summaries:', summaries)
                })
                .catch(error => {
                    console.error('Error fetching previous chapter summaries:', error)
                })
        }
    }, [chapter, getPreviousChapterSummaries])

    const schema = BlockNoteSchema.create({
        blockSpecs: {
            // Adds all default blocks.
            ...defaultBlockSpecs,
            // Adds the Scene Beat block.
            sceneBeat: SceneBeat(chapter?.story_id, chapter?.chapter_number, chapterId),
        },
    });

    const insertSceneBeat = (editor: typeof schema.BlockNoteEditor) => ({
        title: 'Scene Beat',
        onItemClick: () => {
            insertOrUpdateBlock(editor, {
                type: 'sceneBeat',
            });
        },
        aliases: [
            'sceneBeat',
            'notification',
            'emphasize',
            'warning',
            'error',
            'info',
            'success',
        ],
        group: 'Scene Beat',
        icon: <HiOutlineBookOpen />,
        key: 'sceneBeat',
    });

    // Create editor instance after content is loaded
    const editor = useMemo(() => {
        if (isLoading || !chapter) {
            return undefined
        }

        const initialContent = chapter.chapter_data?.content
            ? (typeof chapter.chapter_data.content === 'string'
                ? JSON.parse(chapter.chapter_data.content).content
                : chapter.chapter_data.content)
            : [{
                id: crypto.randomUUID(),
                type: 'paragraph',
                props: {
                    textColor: 'default',
                    textAlignment: 'left',
                    backgroundColor: 'default'
                },
                content: [{
                    type: 'text',
                    text: 'Start writing your story here...',
                    styles: {}
                }],
                children: []
            }]

        return BlockNoteEditor.create({
            schema,
            initialContent
        })
    }, [chapter, isLoading])

    const handleSave = async () => {
        if (!editor) return

        setIsSaving(true)
        try {
            // Get current POV settings from IndexedDB
            const povSettings = await povSettingsDB.getPOVSettings(chapterId)

            // Save both editor content and POV settings
            await updateChapter(chapterId, {
                chapter_data: {
                    content: editor.document
                },
                pov_type: povSettings?.pov_type || "Third Person Omniscient",
                pov_character: povSettings?.pov_character || ""
            })

            toast.success('Chapter saved successfully')
        } catch (error) {
            console.error('Error saving chapter:', error)
            toast.error('Failed to save chapter')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading || !editor) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-gray-500">Loading editor...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-red-500">Error loading chapter content</div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile layout (stacked) */}
                    <div className="sm:hidden">
                        {/* Title row */}
                        <div className="h-16 flex items-center justify-center">
                            <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[300px]">
                                {chapter.title}
                            </h1>
                        </div>

                        {/* Controls row */}
                        <div className="h-14 flex items-center justify-end gap-3 pb-3">
                            <POVSelector
                                chapterId={chapterId}
                                storyId={chapter.story_id}
                            />
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 max-w-[150px]"
                            >
                                <span className="truncate">
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                            Save
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* Desktop layout (single row) */}
                    <div className="hidden sm:flex h-16 items-center">
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[600px]">
                                {chapter.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <POVSelector
                                chapterId={chapterId}
                                storyId={chapter.story_id}
                            />
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Save
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-6 px-4">
                <BlockNoteView
                    editor={editor}
                    slashMenu={false}
                >
                    <SuggestionMenuController
                        triggerCharacter={'/'}
                        getItems={async (query) =>
                            filterSuggestionItems(
                                [insertSceneBeat(editor), ...getDefaultReactSlashMenuItems(editor)],
                                query
                            )
                        }
                    />
                </BlockNoteView>
            </div>
        </div>
    );
};

export default Editor;

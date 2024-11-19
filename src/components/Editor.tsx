import {
    BlockNoteEditor,
    BlockNoteSchema,
    PartialBlock,
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
import { RiAlertFill } from 'react-icons/ri';
import { SceneBeat } from './SceneBeat';
import { useMemo, useState } from 'react';
import { useChapter, useChapterStore } from '../store/useChapterStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

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

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
    blockSpecs: {
        // Adds all default blocks.
        ...defaultBlockSpecs,
        // Adds the Scene Beat block.
        sceneBeat: SceneBeat(sendToBackend),
    },
});

// Slash menu item to insert an Alert block
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
    icon: <RiAlertFill />,
    key: 'sceneBeat',
});

interface EditorProps {
    chapterId: string;
}

const Editor = ({ chapterId }: EditorProps) => {
    const { data: chapter, error, isLoading } = useChapter(chapterId)
    const { updateChapter } = useChapterStore()
    const [isSaving, setIsSaving] = useState(false)

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
            await updateChapter(chapterId, {
                chapter_data: {
                    content: editor.document
                }
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
                    <div className="h-16 flex items-center justify-between">
                        <h1 className="text-xl pl-8 lg:pl-0 font-semibold text-gray-900">
                            {chapter.title}
                        </h1>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save
                                </>
                            )}
                        </Button>
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

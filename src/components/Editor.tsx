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
import { useEffect, useMemo, useState } from 'react';
import { useChapterStore } from '../store/useChapterStore';
import toast from 'react-hot-toast';

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
    const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">("loading");
    const [isSaving, setIsSaving] = useState(false);
    const { currentChapter, fetchChapter, updateChapter } = useChapterStore();

    // Load chapter content
    useEffect(() => {
        const loadChapterContent = async () => {
            try {
                console.log('Fetching chapter content...');
                await fetchChapter(chapterId);
                
                const chapter = useChapterStore.getState().currentChapter;
                
                if (chapter?.chapter_data?.content) {
                    console.log('Found existing content:', chapter.chapter_data.content);
                    // Parse the content if it's a string (JSON)
                    const content = typeof chapter.chapter_data.content === 'string' 
                        ? JSON.parse(chapter.chapter_data.content).content 
                        : chapter.chapter_data.content;
                    
                    setInitialContent(content);
                } else {
                    console.log('No existing content, setting default content');
                    setInitialContent([{
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
                    }]);
                }
            } catch (error) {
                console.error('Error loading chapter:', error);
                toast.error('Failed to load chapter content');
                setInitialContent(undefined);
            }
        };

        loadChapterContent();
    }, [chapterId]);

    // Create editor instance after content is loaded
    const editor = useMemo(() => {
        if (initialContent === "loading") {
            return undefined;
        }
        console.log('Creating editor with initial content:', initialContent);
        return BlockNoteEditor.create({ 
            schema,
            initialContent 
        });
    }, [initialContent]);

    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        console.log('Starting save process...');
        console.log('Current document:', editor.document);
        
        try {
            const updateData = {
                chapter_data: {
                    content: editor.document
                }
            };
            console.log('Sending update data:', updateData);

            await updateChapter(chapterId, updateData);
            console.log('Save successful');
            toast.success('Chapter saved successfully');
        } catch (error) {
            console.error('Error saving chapter:', error);
            toast.error('Failed to save chapter');
        } finally {
            setIsSaving(false);
        }
    };

    if (!editor) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-gray-500">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                </button>
            </div>
            <div className="p-4">
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

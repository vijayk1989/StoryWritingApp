import {
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
    useCreateBlockNote,
} from '@blocknote/react';

import { RiAlertFill } from 'react-icons/ri';
import { SceneBeat } from './SceneBeat';

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

export default function App() {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        schema,
        initialContent: [
            {
                type: 'paragraph',
                content: "Start writing your story here...",
            },
            {
                type: 'paragraph',
            },
        ],
    });

    // Renders the editor instance.
    return (
        <BlockNoteView editor={editor} slashMenu={false}>
            {/* Replaces the default Slash Menu. */}
            <SuggestionMenuController
                triggerCharacter={'/'}
                getItems={async (query) =>
                    // Gets all default slash menu items and `insertAlert` item.
                    filterSuggestionItems(
                        [insertSceneBeat(editor), ...getDefaultReactSlashMenuItems(editor)],
                        query
                    )
                }
            />
        </BlockNoteView>
    );
}

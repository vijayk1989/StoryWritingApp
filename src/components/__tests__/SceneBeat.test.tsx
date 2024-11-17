import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SceneBeat } from '../SceneBeat';

// Mock the BlockNote dependencies
vi.mock('@blocknote/react', () => ({
    createReactBlockSpec: (config: any, implementation: any) => ({
        type: config.type,
        ReactComponent: implementation.render
    })
}));

describe('SceneBeat Component', () => {
    // Mock the editor and required props
    const mockEditor = {
        getBlock: vi.fn(),
        document: [
            { 
                id: 'current-block',
                type: 'sceneBeat',
                content: [{ text: 'Scene prompt' }]
            }
        ],
        insertBlocks: vi.fn(),
        updateBlock: vi.fn(),
    };

    const mockSendToBackend = vi.fn();

    beforeEach(() => {  
        vi.clearAllMocks();
        // Setup the getBlock mock to return our test content
        mockEditor.getBlock.mockReturnValue({
            content: [{ text: 'Scene prompt' }]
        });
    });

    it('renders with generate button', () => {
        const sceneBeatSpec = SceneBeat(mockSendToBackend);
        const Component = sceneBeatSpec.ReactComponent;
        
        render(
            <Component 
                editor={mockEditor}
                block={{ id: 'current-block' }}
                contentRef={{ current: null }}
            />
        );

        expect(screen.getByText('Generate Prose')).toBeInTheDocument();
    });

    it('calls sendToBackend when generate button is clicked', async () => {
        // Setup mock response
        mockSendToBackend.mockResolvedValue({
            body: new ReadableStream({
                start(controller) {
                    controller.close();
                }
            })
        });

        const sceneBeatSpec = SceneBeat(mockSendToBackend);
        const Component = sceneBeatSpec.ReactComponent;
        
        render(
            <Component 
                editor={mockEditor}
                block={{ id: 'current-block' }}
                contentRef={{ current: null }}
            />
        );

        // Click the generate button
        const generateButton = screen.getByText('Generate Prose');
        await fireEvent.click(generateButton);

        // Verify sendToBackend was called with the correct prompt
        expect(mockSendToBackend).toHaveBeenCalledWith(
            expect.stringContaining('Scene prompt')
        );

        // Verify that insertBlocks was called to create the new block
        expect(mockEditor.insertBlocks).toHaveBeenCalledWith(
            [expect.objectContaining({ type: 'paragraph' })],
            'current-block',
            'after'
        );
    });
});

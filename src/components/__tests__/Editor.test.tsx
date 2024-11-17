import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Editor from '../Editor';

describe('Editor Component', () => {
    it('renders with initial content', async () => {
        render(<Editor />);
        // Wait for the content to appear
        const content = await screen.findByText((content) => 
            content.includes('Start writing your story here'),
            { exact: false }
        );
        expect(content).toBeInTheDocument();
    });

    it('renders the BlockNoteView component', () => {
        const { container } = render(<Editor />);
        
        // Check for the BlockNote container
        expect(container.querySelector('.bn-container')).toBeInTheDocument();
        
        // Check for the Mantine specific class
        expect(container.querySelector('.bn-mantine')).toBeInTheDocument();
        
        // Check for the editor's aria attributes
        expect(container.querySelector('[aria-autocomplete="list"]')).toBeInTheDocument();
    });
});
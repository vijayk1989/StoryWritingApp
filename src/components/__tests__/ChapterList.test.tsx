import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ChaptersList from '../ChaptersList'
import { useChapters, useChapterStore } from '../../store/useChapterStore'
import type { Chapter } from '../../types/chapter'
import type { SWRResponse } from 'swr'
import { mutate } from 'swr'

// Mock SWR's mutate
vi.mock('swr', async () => {
    const actual = await vi.importActual('swr')
    return {
        ...actual,
        mutate: vi.fn(),
    }
})

// Mock the hooks and stores
vi.mock('../../store/useChapterStore', () => ({
    useChapters: vi.fn(),
    useChapterStore: vi.fn(),
}))

vi.mock('../../lib/indexedDB', () => ({
    summariesDB: {
        getSummaries: vi.fn(() => Promise.resolve([])),
        setSummaries: vi.fn(),
    },
}))

describe('ChaptersList', () => {
    const mockChapter: Chapter = {
        id: 'chapter-1',
        story_id: 'story-1',
        title: 'Chapter 1',
        chapter_number: 1,
        summary: 'Test summary',
        chapter_data: { content: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock SWR response with proper type
        const mockSWRResponse: SWRResponse<Chapter[], any> = {
            data: [mockChapter],
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        }

        vi.mocked(useChapters).mockReturnValue(mockSWRResponse)

        // Mock store methods
        vi.mocked(useChapterStore).mockImplementation(() => ({
            updateChapter: vi.fn().mockResolvedValue(undefined),
            deleteChapter: vi.fn().mockResolvedValue(undefined),
            updateStoredSummaries: vi.fn().mockResolvedValue(undefined),
        }))
    })

    it('renders chapters list', () => {
        render(<ChaptersList storyId="story-1" />)
        expect(screen.getByText('Chapter 1')).toBeInTheDocument()
    })

    it('handles summary updates', async () => {
        const mockUpdateChapter = vi.fn().mockResolvedValue(undefined)
        vi.mocked(useChapterStore).mockImplementation(() => ({
            updateChapter: mockUpdateChapter,
            deleteChapter: vi.fn(),
            updateStoredSummaries: vi.fn(),
        }))

        render(<ChaptersList storyId="story-1" />)

        // First, click the accordion trigger to expand it
        const accordionTrigger = screen.getByText('Chapter 1')
        fireEvent.click(accordionTrigger)

        // Now we can find and interact with the textarea
        const textarea = await screen.findByLabelText('Chapter summary')
        fireEvent.change(textarea, { target: { value: 'New summary' } })

        const saveButton = screen.getByText('Save Summary')
        fireEvent.click(saveButton)

        await waitFor(() => {
            expect(mockUpdateChapter).toHaveBeenCalledWith('chapter-1', { summary: 'New summary' })
            expect(mutate).toHaveBeenCalled()
        })
    })

    it('handles chapter deletion', async () => {
        const mockDeleteChapter = vi.fn().mockResolvedValue(undefined)
        vi.mocked(useChapterStore).mockImplementation(() => ({
            updateChapter: vi.fn(),
            deleteChapter: mockDeleteChapter,
            updateStoredSummaries: vi.fn(),
        }))

        render(<ChaptersList storyId="story-1" />)

        // First, click the accordion trigger to expand it
        const accordionTrigger = screen.getByText('Chapter 1')
        fireEvent.click(accordionTrigger)

        // Click the trash icon (using the aria-label from the HiTrash icon)
        const deleteIcon = screen.getByLabelText('Delete chapter')
        fireEvent.click(deleteIcon)

        // Now click the confirm delete button in the alert dialog
        const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' })
        fireEvent.click(confirmDeleteButton)

        await waitFor(() => {
            expect(mockDeleteChapter).toHaveBeenCalledWith('chapter-1', 'story-1')
            expect(mutate).toHaveBeenCalled()
        })
    })

    it('shows empty state when no chapters exist', () => {
        const emptyResponse: SWRResponse<Chapter[], any> = {
            data: [],
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        }
        vi.mocked(useChapters).mockReturnValue(emptyResponse)

        render(<ChaptersList storyId="story-1" />)
        expect(screen.getByText(/no chapters yet/i)).toBeInTheDocument()
    })

    it('handles loading state', () => {
        const loadingResponse: SWRResponse<Chapter[], any> = {
            data: undefined,
            error: null,
            isLoading: true,
            isValidating: true,
            mutate: vi.fn(),
        }
        vi.mocked(useChapters).mockReturnValue(loadingResponse)

        render(<ChaptersList storyId="story-1" />)
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('handles error state', () => {
        const errorResponse: SWRResponse<Chapter[], any> = {
            data: undefined,
            error: new Error('Failed to load chapters'),
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        }
        vi.mocked(useChapters).mockReturnValue(errorResponse)

        render(<ChaptersList storyId="story-1" />)
        expect(screen.getByText('Error loading chapters')).toBeInTheDocument()
    })
})

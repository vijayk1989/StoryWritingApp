import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CreateChapterForm from '../CreateChapterForm'
import { useChapters, useChapterStore } from '../../store/useChapterStore'
import type { Chapter } from '../../types/chapter'
import type { SWRResponse } from 'swr'
import { mutate } from 'swr'
import toast from 'react-hot-toast'

// Mock SWR's mutate
vi.mock('swr', async () => {
    const actual = await vi.importActual('swr')
    return {
        ...actual,
        mutate: vi.fn(),
    }
})

// Mock the store hooks
vi.mock('../../store/useChapterStore', () => ({
    useChapters: vi.fn(),
    useChapterStore: vi.fn(),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    }
}))

describe('CreateChapterForm', () => {
    const mockChapter: Chapter = {
        id: 'new-chapter',
        title: 'New Chapter',
        story_id: 'story-1',
        chapter_number: 1,
        chapter_data: { content: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock SWR response
        const mockSWRResponse: SWRResponse<Chapter[], any> = {
            data: [],
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        }
        vi.mocked(useChapters).mockReturnValue(mockSWRResponse)

        // Mock store
        vi.mocked(useChapterStore).mockImplementation(() => ({
            createChapter: vi.fn().mockResolvedValue(mockChapter),
            isCreating: false,
        }))
    })

    it('renders form elements', () => {
        render(<CreateChapterForm storyId="story-1" />)
        expect(screen.getByPlaceholderText('Enter chapter title')).toBeInTheDocument()
        expect(screen.getByText('Create Chapter')).toBeInTheDocument()
    })

    it('handles chapter creation successfully', async () => {
        const mockCreateChapter = vi.fn().mockResolvedValue(mockChapter)
        vi.mocked(useChapterStore).mockImplementation(() => ({
            createChapter: mockCreateChapter,
            isCreating: false,
        }))

        render(<CreateChapterForm storyId="story-1" />)

        const input = screen.getByPlaceholderText('Enter chapter title')
        fireEvent.change(input, { target: { value: 'New Chapter' } })

        const submitButton = screen.getByText('Create Chapter')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockCreateChapter).toHaveBeenCalledWith({
                title: 'New Chapter',
                story_id: 'story-1',
                chapter_data: expect.any(Object),
            })
            expect(mutate).toHaveBeenCalled()
        })
    })

    it('shows loading state while creating', () => {
        vi.mocked(useChapterStore).mockImplementation(() => ({
            createChapter: vi.fn(),
            isCreating: true,
        }))

        render(<CreateChapterForm storyId="story-1" />)
        expect(screen.getByText('Creating...')).toBeInTheDocument()
    })

    it('handles creation error', async () => {
        const mockCreateChapter = vi.fn().mockRejectedValue(new Error('Creation failed'))
        vi.mocked(useChapterStore).mockImplementation(() => ({
            createChapter: mockCreateChapter,
            isCreating: false,
        }))

        render(<CreateChapterForm storyId="story-1" />)

        const input = screen.getByPlaceholderText('Enter chapter title')
        fireEvent.change(input, { target: { value: 'New Chapter' } })

        const submitButton = screen.getByText('Create Chapter')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to create chapter')
            expect(mutate).toHaveBeenCalled()
        })
    })

    it('prevents empty title submission', () => {
        const mockCreateChapter = vi.fn()
        vi.mocked(useChapterStore).mockImplementation(() => ({
            createChapter: mockCreateChapter,
            isCreating: false,
        }))

        render(<CreateChapterForm storyId="story-1" />)

        const submitButton = screen.getByText('Create Chapter')
        fireEvent.click(submitButton)

        expect(mockCreateChapter).not.toHaveBeenCalled()
    })
})

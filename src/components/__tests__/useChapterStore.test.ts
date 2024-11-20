import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Chapter } from '../../types/chapter'
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js'

// Create a partial mock type
type PartialPostgrestQueryBuilder = Partial<PostgrestQueryBuilder<any, any, any, any>>

// Mock modules before any other code
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn(),
                        }),
                    }),
                }),
                single: vi.fn(),
            }),
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn(),
                }),
            }),
            update: vi.fn().mockReturnValue({
                eq: vi.fn(),
            }),
            delete: vi.fn().mockReturnValue({
                eq: vi.fn(),
            }),
        }) as unknown as PostgrestQueryBuilder<any, any, any, any>,
    },
}))

vi.mock('swr', () => ({
    default: vi.fn(),
    mutate: vi.fn(),
}))

vi.mock('../../lib/indexedDB', () => ({
    summariesDB: {
        setSummaries: vi.fn(),
        getSummaries: vi.fn(),
        clearSummaries: vi.fn(),
    },
}))

// Import after mocks
import { useChapterStore } from '../../store/useChapterStore'
import { supabase } from '../../lib/supabase'
import { summariesDB } from '../../lib/indexedDB'

// Create mock data after imports
const mockChapter: Chapter = {
    id: 'test-id',
    story_id: 'story-1',
    title: 'Test Chapter',
    chapter_number: 1,
    chapter_data: { content: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

describe('useChapterStore', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useChapterStore.setState({
            isCreating: false,
            isSaving: false,
            error: null,
            currentStoryId: null,
            summariesSoFar: '',
        })

        // Setup mock responses here instead of in the vi.mock
        vi.mocked(supabase.from).mockImplementation(() => ({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({
                                data: mockChapter,
                                error: null,
                            }),
                        }),
                    }),
                }),
                single: vi.fn().mockResolvedValue({
                    data: mockChapter,
                    error: null,
                }),
            }),
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: mockChapter,
                        error: null,
                    }),
                }),
            }),
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: null,
                    error: null,
                }),
            }),
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: null,
                    error: null,
                }),
            }),
        }) as unknown as PostgrestQueryBuilder<any, any, any, any>)
    })

    describe('createChapter', () => {
        it('should create a chapter successfully', async () => {
            const store = useChapterStore.getState()
            const chapterData = {
                title: 'Test Chapter',
                story_id: 'story-1',
                chapter_data: { content: [] },
            }

            const result = await store.createChapter(chapterData)

            expect(result).toEqual(mockChapter)
            expect(supabase.from).toHaveBeenCalledWith('chapters')
            expect(store.isCreating).toBe(false)
            expect(store.error).toBeNull()
        })
    })

    describe('updateChapter', () => {
        it('should update a chapter successfully', async () => {
            const store = useChapterStore.getState()
            await store.updateChapter('test-id', { title: 'Updated Title' })

            expect(supabase.from).toHaveBeenCalledWith('chapters')
            expect(store.error).toBeNull()
        })

        it('should handle update errors', async () => {
            const error = new Error('Update failed')

            // Mock the error response more completely
            vi.mocked(supabase.from).mockReturnValueOnce({
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({
                        data: null,
                        error: {
                            message: 'Update failed'
                        }
                    }),
                }),
            } as unknown as PostgrestQueryBuilder<any, any, any, any>)

            const store = useChapterStore.getState()

            // Expect the promise to reject
            await expect(
                store.updateChapter('test-id', { title: 'Updated Title' })
            ).rejects.toThrow('Update failed')

            // Check the store state after the error
            const storeState = useChapterStore.getState()
            expect(storeState.error).toBe('Update failed')
        })
    })

    describe('deleteChapter', () => {
        it('should delete a chapter successfully', async () => {
            const store = useChapterStore.getState()
            await store.deleteChapter('test-id', 'story-1')

            expect(supabase.from).toHaveBeenCalledWith('chapters')
            expect(store.error).toBeNull()
        })
    })
})

import { useState } from 'react'
import { useChapterStore, useChapters } from '../store/useChapterStore'
import toast from 'react-hot-toast'
import { type PartialBlock } from '@blocknote/core'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { mutate } from 'swr'

interface CreateChapterFormProps {
  storyId: string
}

export default function CreateChapterForm({ storyId }: CreateChapterFormProps) {
  const [title, setTitle] = useState('')
  const { createChapter, isCreating } = useChapterStore()
  const { data: chapters } = useChapters(storyId)

  const initialContent: PartialBlock[] = [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start writing your story here...', styles: {} }]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Calculate next chapter number
    const nextChapterNumber = chapters && chapters.length > 0
      ? Math.max(...chapters.map(ch => ch.chapter_number)) + 1
      : 1

    // Create optimistic chapter
    const optimisticChapter = {
      id: `temp-${Date.now()}`,
      title,
      story_id: storyId,
      chapter_number: nextChapterNumber,
      chapter_data: { content: initialContent },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Optimistically update UI
    mutate(
      `chapters/${storyId}`,
      [...(chapters || []), optimisticChapter],
      false
    )

    try {
      const createdChapter = await createChapter({
        title,
        story_id: storyId,
        chapter_data: { content: initialContent }
      })

      // Update the cache with the real chapter data
      mutate(`chapters/${storyId}`)

      setTitle('')
      toast.success('Chapter created!')
    } catch (error) {
      // Rollback on error
      mutate(`chapters/${storyId}`, chapters)
      toast.error('Failed to create chapter')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chapter title"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isCreating}
          className="min-w-[140px]"
        >
          {isCreating ? 'Creating...' : 'Create Chapter'}
        </Button>
      </div>
    </form>
  )
}

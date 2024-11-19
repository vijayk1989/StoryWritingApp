import { useState } from 'react'
import { useChapterStore } from '../store/useChapterStore'
import toast from 'react-hot-toast'
import { type PartialBlock } from '@blocknote/core'

interface CreateChapterFormProps {
  storyId: string
}

export default function CreateChapterForm({ storyId }: CreateChapterFormProps) {
  const [title, setTitle] = useState('')
  const { createChapter, isCreating } = useChapterStore()

  const initialContent: PartialBlock[] = [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start writing your story here...', styles: {} }]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createChapter({
        title,
        story_id: storyId,
        chapter_data: { content: initialContent }
      })
      setTitle('')
      toast.success('Chapter created!')
    } catch (error) {
      toast.error('Failed to create chapter')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end mb-8">
      <div className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chapter title"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isCreating}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
      >
        {isCreating ? 'Creating...' : 'Create Chapter'}
      </button>
    </form>
  )
}

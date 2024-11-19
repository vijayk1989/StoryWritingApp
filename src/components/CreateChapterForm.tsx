import { useState } from 'react'
import { useChapterStore } from '../store/useChapterStore'
import toast from 'react-hot-toast'
import { type PartialBlock } from '@blocknote/core'

interface CreateChapterFormProps {
  storyId: string
}

export default function CreateChapterForm({ storyId }: CreateChapterFormProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const { createChapter, isCreating } = useChapterStore()

  const initialContent: PartialBlock[] = [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start writing your story here...', styles: {} }]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createChapter({
        title,
        summary,
        story_id: storyId,
        chapter_number: 1, // This should be calculated based on existing chapters
        chapter_data: { content: initialContent }
      })
      setTitle('')
      setSummary('')
      toast.success('Chapter created!')
    } catch (error) {
      toast.error('Failed to create chapter')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Chapter Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary (optional)
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-4 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={isCreating}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isCreating ? 'Creating...' : 'Create Chapter'}
      </button>
    </form>
  )
}

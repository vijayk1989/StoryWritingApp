import { useState } from 'react'
import { useStoryStore } from '../store/useStoryStore'
import toast from 'react-hot-toast'

export default function CreateStoryForm() {
  const [title, setTitle] = useState('')
  const { createStory, isCreating } = useStoryStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createStory(title)
      setTitle('')
      toast.success('Story created successfully!')
    } catch (error) {
      toast.error('Failed to create story')
      console.error('Error creating story:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      <div className="flex-1">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter story title..."
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isCreating}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>{isCreating ? 'Creating...' : 'Create Story'}</span>
        {isCreating && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>
    </form>
  )
}
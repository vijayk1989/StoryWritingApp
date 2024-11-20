import { useState } from 'react'
import { useStoryStore } from '../store/useStoryStore'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { HiOutlineRefresh } from 'react-icons/hi'

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
        <Input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter story title..."
          required
        />
      </div>
      <Button type="submit" disabled={isCreating}>
        {isCreating ? (
          <>
            <HiOutlineRefresh className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Story'
        )}
      </Button>
    </form>
  )
}

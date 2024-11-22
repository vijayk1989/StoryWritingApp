import { useState } from 'react'
import { useStoryStore } from '../store/useStoryStore'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { HiOutlineRefresh } from 'react-icons/hi'
import { storySettingsDB } from '../lib/indexedDB'

export default function CreateStoryForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [language, setLanguage] = useState('English')
  const { createStory, isCreating } = useStoryStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const story = await createStory(title, language, author)
      await storySettingsDB.setStorySettings(story.id, {
        language,
        author
      })
      setTitle('')
      setAuthor('')
      setLanguage('English')
      setIsOpen(false)
      toast.success('Story created successfully!')
    } catch (error) {
      toast.error('Failed to create story')
      console.error('Error creating story:', error)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full p-6 border-2 border-dashed bg-white hover:bg-white"
      >
        + Create New Story
      </Button>
    )
  }

  return (
    <Card className="bg-white">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title..."
              className="bg-white border-gray-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name..."
              className="bg-white border-gray-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Enter language..."
              className="bg-white border-gray-300"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
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
        </CardFooter>
      </form>
    </Card>
  )
}

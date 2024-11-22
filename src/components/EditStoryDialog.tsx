import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { HiOutlineRefresh } from 'react-icons/hi'
import toast from 'react-hot-toast'
import type { Story } from '../types/story'
import { storySettingsDB } from '../lib/indexedDB'
import { useStoryStore } from '@/store/useStoryStore'

interface EditStoryDialogProps {
    story: Story
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditStoryDialog({ story, open, onOpenChange }: EditStoryDialogProps) {
    const { updateStory, isUpdating } = useStoryStore()
    const [title, setTitle] = useState(story.title)
    const [author, setAuthor] = useState(story.author || '')
    const [language, setLanguage] = useState(story.language || 'English')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateStory(story.id, {
                title,
                language,
                author
            })

            await storySettingsDB.setStorySettings(story.id, {
                language,
                author
            })

            onOpenChange(false)
            toast.success('Story updated successfully!')
        } catch (error) {
            toast.error('Failed to update story')
            console.error('Error updating story:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Story</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white border-gray-300"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="bg-white border-gray-300"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-white border-gray-300"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <HiOutlineRefresh className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

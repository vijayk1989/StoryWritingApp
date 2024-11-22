import { useState } from 'react'
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri'
import { useStoryStore } from '../store/useStoryStore'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import type { Story } from '../types/story'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import EditStoryDialog from './EditStoryDialog'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StoriesList() {
  const { data: stories, error, isLoading } = useSWR<Story[]>(
    '/api/stories',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
    }
  )
  const { deleteStory } = useStoryStore()
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null)
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await deleteStory(id)
      setStoryToDelete(null)
      toast.success('Story deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete story')
      console.error('Error deleting story:', error)
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading stories</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6">
        {!stories?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't created any stories yet.</p>
            <p className="text-gray-500">Enter a title above to create your first story!</p>
          </div>
        ) : (
          stories.map((story) => (
            <Card key={story.id} className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setStoryToEdit(story)
                  }}
                  title="Edit story"
                >
                  <RiEditLine className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setStoryToDelete(story.id)
                  }}
                  title="Delete story"
                >
                  <RiDeleteBinLine className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <a href={`/story/${story.id}`}>
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(story.created_at).toLocaleDateString()}
                  </p>
                  {story.author && (
                    <p className="text-sm text-muted-foreground mt-1">
                      By {story.author}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Language: {story.language}
                  </p>
                </CardContent>
              </a>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!storyToDelete} onOpenChange={() => setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story and all its chapters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => storyToDelete && handleDelete(storyToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {storyToEdit && (
        <EditStoryDialog
          story={storyToEdit}
          open={!!storyToEdit}
          onOpenChange={(open) => !open && setStoryToEdit(null)}
        />
      )}
    </>
  )
}

import { RiDeleteBinLine } from 'react-icons/ri'
import { useStoryStore } from '../store/useStoryStore'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import type { Story } from '../types/story'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

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

  const handleDelete = async (id: string) => {
    try {
      await deleteStory(id)
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
    <div className="grid gap-6">
      {!stories?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't created any stories yet.</p>
          <p className="text-gray-500">Enter a title above to create your first story!</p>
        </div>
      ) : (
        stories.map((story) => (
          <Card key={story.id} className="relative group">
            <a href={`/story/${story.id}`}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(story.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(story.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete story"
            >
              <RiDeleteBinLine className="h-4 w-4 text-destructive" />
            </Button>
          </Card>
        ))
      )}
    </div>
  )
}

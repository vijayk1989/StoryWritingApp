import { useEffect, useState } from 'react'
import { useChapterStore } from '../store/useChapterStore'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'
import { HiPencilSquare, HiTrash } from 'react-icons/hi2'
import toast from 'react-hot-toast'
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

interface ChaptersListProps {
  storyId: string
}

export default function ChaptersList({ storyId }: ChaptersListProps) {
  const { chapters, isLoading, error, fetchChapters, updateChapter, deleteChapter } = useChapterStore()
  const [editingSummary, setEditingSummary] = useState<string | null>(null)
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchChapters(storyId)
  }, [storyId])

  const handleSaveSummary = async (chapterId: string, summary: string) => {
    try {
      await updateChapter(chapterId, { summary })
      setEditingSummary(null)
      toast.success('Summary updated')
    } catch (error) {
      toast.error('Failed to update summary')
    }
  }

  const handleDelete = async (chapterId: string) => {
    try {
      await deleteChapter(chapterId)
      toast.success('Chapter deleted')
      setChapterToDelete(null)
    } catch (error) {
      toast.error('Failed to delete chapter')
    }
  }

  const handleGenerateSummary = async (chapterId: string) => {
    // TODO: Implement AI summary generation
    toast.success('Summary generation coming soon!')
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading chapters...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No chapters yet. Create your first chapter above!
      </div>
    )
  }

  return (
    <>
      <Accordion type="single" collapsible className="space-y-4">
        {chapters.map((chapter) => (
          <AccordionItem
            key={chapter.id}
            value={chapter.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center justify-between flex-1">
                <h3 className="text-lg font-semibold">
                  {chapter.title}
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={`/story/${storyId}/chapter/${chapter.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiPencilSquare className="h-5 w-5" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setChapterToDelete(chapter.id)
                    }}
                    className="p-2 text-gray-500 hover:text-red-600"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <textarea
                  value={editingSummary ?? chapter.summary ?? ''}
                  onChange={(e) => setEditingSummary(e.target.value)}
                  placeholder="Enter chapter summary..."
                  className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex justify-between gap-4">
                  <Button
                    onClick={() => handleGenerateSummary(chapter.id)}
                    variant="outline"
                  >
                    Generate Summary
                  </Button>
                  <Button
                    onClick={() => handleSaveSummary(chapter.id, editingSummary || '')}
                    disabled={editingSummary === chapter.summary}
                  >
                    Save Summary
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog open={!!chapterToDelete} onOpenChange={() => setChapterToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chapter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => chapterToDelete && handleDelete(chapterToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

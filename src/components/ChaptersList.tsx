import { useEffect } from 'react'
import { useChapterStore } from '../store/useChapterStore'

interface ChaptersListProps {
  storyId: string
}

export default function ChaptersList({ storyId }: ChaptersListProps) {
  const { chapters, isLoading, error, fetchChapters } = useChapterStore()

  useEffect(() => {
    fetchChapters(storyId)
  }, [storyId])

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
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <a
          key={chapter.id}
          href={`/story/${storyId}/chapter/${chapter.id}`}
          className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <h3 className="text-lg font-semibold">
            Chapter {chapter.chapter_number}: {chapter.title}
          </h3>
          {chapter.summary && (
            <p className="text-gray-600 mt-2">{chapter.summary}</p>
          )}
        </a>
      ))}
    </div>
  )
}

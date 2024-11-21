import { useState } from 'react'
import { useChapters, useChapterStore } from '../store/useChapterStore'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'
import { Textarea } from "./ui/textarea"
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
import { mutate } from 'swr'
import { summariesDB } from '../lib/indexedDB'
import { generateCompletion } from '../lib/ai/generation'
import { Prompt } from '@/types/prompt'
import { usePrompts } from '@/hooks/usePrompts'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from './ui/select'
import { handleSummaryStream } from '../lib/ai/summaryStreamUtils'

interface ChaptersListProps {
  storyId: string
}

export default function ChaptersList({ storyId }: ChaptersListProps) {
  const { data: chapters, error, isLoading } = useChapters(storyId)
  const { updateChapter, deleteChapter, updateStoredSummaries } = useChapterStore()
  const [editingSummary, setEditingSummary] = useState<string | null>(null)
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null)
  const { prompts, systemPrompts } = usePrompts()
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')

  const handleSaveSummary = async (chapterId: string, summary: string) => {
    const previousChapters = chapters
    const previousSummaries = await summariesDB.getSummaries(storyId)

    const updatingChapter = chapters?.find(ch => ch.id === chapterId)
    if (!updatingChapter) return

    // Optimistically update UI
    mutate(
      `chapters/${storyId}`,
      chapters?.map(ch =>
        ch.id === chapterId ? { ...ch, summary } : ch
      ),
      false
    )

    // Optimistically update IndexedDB
    const updatedSummaries = previousSummaries.length > 0
      ? previousSummaries.map(sum =>
        sum.chapter_number === updatingChapter.chapter_number
          ? { ...sum, summary }
          : sum
      )
      : [{ chapter_number: updatingChapter.chapter_number, summary }]

    await summariesDB.setSummaries(storyId, updatedSummaries)

    try {
      await updateChapter(chapterId, { summary })
      // Update both caches after successful save
      mutate(`chapters/${storyId}`)
      await updateStoredSummaries(storyId)
      setEditingSummary(null)
      setEditingChapterId(null)
      toast.success('Summary updated')
    } catch (error) {
      // Rollback both UI and cache on error
      mutate(`chapters/${storyId}`, previousChapters)
      await summariesDB.setSummaries(storyId, previousSummaries)
      toast.error('Failed to update summary')
    }
  }

  const handleDelete = async (chapterId: string) => {
    const previousChapters = chapters
    const previousSummaries = await summariesDB.getSummaries(storyId)

    // Optimistically update UI
    mutate(
      `chapters/${storyId}`,
      chapters?.filter(ch => ch.id !== chapterId),
      false
    )

    try {
      await deleteChapter(chapterId, storyId)
      await updateStoredSummaries(storyId)
      toast.success('Chapter deleted')
      setChapterToDelete(null)
    } catch (error) {
      // Rollback on error
      mutate(`chapters/${storyId}`, previousChapters)
      await summariesDB.setSummaries(storyId, previousSummaries)
      toast.error('Failed to delete chapter')
    }
  }

  const handleGenerateSummary = async (chapterId: string) => {
    const chapter = chapters?.find(ch => ch.id === chapterId);
    if (!chapter || !selectedPrompt || !selectedModel) {
      toast.error('Please select a prompt and model first');
      return;
    }

    try {
      // Extract scene beats from chapter content
      const sceneBeatContent = chapter.chapter_data.content
        .filter(block => block.type === 'sceneBeat')
        .map(block => block.content
          .map(content => content.text)
          .join(' ')
        )
        .join('\n');

      // Get the vendor and model ID from the selected model
      const [vendor, ...modelParts] = selectedModel.split('/')
      const modelId = vendor === 'openrouter' ? modelParts.join('/') : modelParts[0]

      // Replace placeholder in prompt messages
      const messages = selectedPrompt.prompt_data.map(msg => ({
        ...msg,
        content: msg.content.replace('{{chapter_content}}', sceneBeatContent)
      }));

      const response = await generateCompletion({
        messages,
        model: modelId,
        vendor,
        stream: true,
        temperature: 0.7,
        max_tokens: 350
      });

      await handleSummaryStream(response, {
        maxWords: 500,
        onContent: (content) => {
          setEditingSummary(content);
          setEditingChapterId(chapterId);
        },
        onStatus: (status) => {
          // Do nothing
        }
      });

      toast.success('Summary generated successfully');

    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading chapters...</div>
  }

  if (error) {
    return <div className="text-red-500">Error loading chapters</div>
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
                <div className="flex items-center">
                  <a
                    href={`/story/${storyId}/chapter/${chapter.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiPencilSquare className="h-5 w-5" />
                  </a>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setChapterToDelete(chapter.id)
                    }}
                    className="p-2 mr-3 text-gray-500 hover:text-red-600 cursor-pointer"
                  >
                    <HiTrash className="h-5 w-5" aria-label="Delete chapter" />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <Textarea
                  value={
                    editingChapterId === chapter.id
                      ? editingSummary ?? ''
                      : chapter.summary ?? ''
                  }
                  onChange={(e) => {
                    setEditingSummary(e.target.value)
                    setEditingChapterId(chapter.id)
                  }}
                  placeholder="Enter chapter summary..."
                  aria-label="Chapter summary"
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleGenerateSummary(chapter.id)}
                    disabled={!selectedPrompt || !selectedModel}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-gray-600 
                              bg-white border border-gray-200 rounded-md 
                              hover:bg-gray-50 hover:border-gray-300 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-all duration-200"
                  >
                    Generate Summary
                  </Button>

                  <Select
                    value={selectedPrompt?.id || ''}
                    onValueChange={(value) => {
                      const prompt = [...prompts, ...systemPrompts].find(p => p.id === value)
                      setSelectedPrompt(prompt || null)
                      setSelectedModel('')
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>System Prompts</SelectLabel>
                        {systemPrompts
                          .filter(p => p.prompt_type === 'gen_summary')
                          .map(prompt => (
                            <SelectItem key={prompt.id} value={prompt.id}>
                              {prompt.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>User Prompts</SelectLabel>
                        {prompts
                          .filter(p => p.prompt_type === 'gen_summary')
                          .map(prompt => (
                            <SelectItem key={prompt.id} value={prompt.id}>
                              {prompt.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {selectedPrompt && (
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedPrompt.allowed_models.split(',').map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex-1" /> {/* Spacer */}

                  <Button
                    onClick={() => handleSaveSummary(chapter.id, editingSummary || '')}
                    disabled={
                      editingChapterId !== chapter.id ||
                      editingSummary === chapter.summary
                    }
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

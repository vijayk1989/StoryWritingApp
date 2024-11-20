import { usePromptStore } from '../store/usePromptStore'
import { useEffect } from 'react'
import type { Prompt } from '../types/prompt'
import { cn } from '../lib/utils'
import { HiOutlineTrash } from 'react-icons/hi'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'

interface PromptsListProps {
    onPromptSelect: (prompt: Prompt) => void
    selectedPromptId?: string
}

export default function PromptsList({ onPromptSelect, selectedPromptId }: PromptsListProps) {
    const { prompts, systemPrompts, fetchPrompts, isLoading, deletePrompt, error } = usePromptStore()

    useEffect(() => {
        const loadPrompts = async () => {
            try {
                await fetchPrompts()
            } catch (error) {
                toast.error('Failed to load prompts')
            }
        }
        loadPrompts()
    }, [fetchPrompts])

    const handleDelete = async (e: React.MouseEvent, promptId: string) => {
        e.stopPropagation()
        try {
            await deletePrompt(promptId)
            toast.success('Prompt deleted successfully')
        } catch (error) {
            toast.error('Failed to delete prompt')
        }
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading prompts: {error}</div>
    }

    if (isLoading) {
        return <div className="p-4 text-gray-500">Loading prompts...</div>
    }

    if (!prompts.length && !systemPrompts.length) {
        return <div className="p-4 text-gray-500">No prompts available</div>
    }

    return (
        <div className="divide-y divide-gray-200">
            {/* System Prompts Section */}
            {systemPrompts.length > 0 && (
                <>
                    <div className="px-4 py-2 bg-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">System Prompts</h3>
                    </div>
                    {systemPrompts.map((prompt) => (
                        <div key={prompt.id} className="group relative">
                            <button
                                onClick={() => onPromptSelect(prompt)}
                                className={cn(
                                    "w-full text-left p-4 hover:bg-gray-100 transition-colors",
                                    "focus:outline-none focus:bg-gray-100",
                                    selectedPromptId === prompt.id && "bg-blue-50 hover:bg-blue-50"
                                )}
                            >
                                <h3 className="font-medium text-gray-900">{prompt.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {prompt.prompt_data.length} messages
                                </p>
                            </button>
                        </div>
                    ))}
                </>
            )}

            {/* User Prompts Section */}
            {prompts.length > 0 && (
                <>
                    <div className="px-4 py-2 bg-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Your Prompts</h3>
                    </div>
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="group relative">
                            <button
                                onClick={() => onPromptSelect(prompt)}
                                className={cn(
                                    "w-full text-left p-4 hover:bg-gray-100 transition-colors",
                                    "focus:outline-none focus:bg-gray-100",
                                    selectedPromptId === prompt.id && "bg-blue-50 hover:bg-blue-50"
                                )}
                            >
                                <h3 className="font-medium text-gray-900">{prompt.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {prompt.prompt_data.length} messages
                                </p>
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleDelete(e, prompt.id)}
                            >
                                <HiOutlineTrash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </>
            )}

            {!prompts.length && !systemPrompts.length && (
                <div className="p-4 text-gray-500">No prompts available</div>
            )}
        </div>
    )
}

import { useState, useEffect } from 'react'
import { usePromptStore } from '../store/usePromptStore'
import { Button } from './ui/button'
import { HiPlus, HiArrowLeft } from 'react-icons/hi'
import PromptsList from './PromptsList'
import PromptForm from './PromptForm'
import type { Prompt } from '../types/prompt'
import { toast } from 'react-hot-toast'
import { cn } from '../lib/utils'

export default function PromptsManager() {
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const { error: promptError } = usePromptStore()
    const [showMobileForm, setShowMobileForm] = useState(false)

    useEffect(() => {
        if (promptError) {
            toast.error(promptError)
        }
    }, [promptError])

    const handleNewPrompt = () => {
        setSelectedPrompt(null)
        setIsCreating(true)
        setShowMobileForm(true)
    }

    const handlePromptSelect = (prompt: Prompt) => {
        setSelectedPrompt(prompt)
        setIsCreating(false)
        setShowMobileForm(true)
    }

    const handleBack = () => {
        setShowMobileForm(false)
        if (!selectedPrompt) {
            setIsCreating(false)
        }
    }

    const handleSave = () => {
        setIsCreating(false)
        setShowMobileForm(false)
    }

    return (
        <div className="flex flex-1 overflow-hidden relative mt-14 lg:mt-0">
            {/* Left panel - Prompts List */}
            <div className={cn(
                "w-full md:w-[300px] border-r border-gray-200 bg-gray-50 flex flex-col",
                showMobileForm ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-gray-200">
                    <Button
                        onClick={handleNewPrompt}
                        className="w-full flex items-center gap-2"
                    >
                        <HiPlus className="h-4 w-4" />
                        New Prompt
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <PromptsList
                        onPromptSelect={handlePromptSelect}
                        selectedPromptId={selectedPrompt?.id}
                    />
                </div>
            </div>

            {/* Right panel - Prompt Form/Editor */}
            <div className={cn(
                "absolute md:relative inset-0 md:inset-auto flex-1 bg-white transition-transform duration-300",
                showMobileForm ? "translate-x-0" : "translate-x-full md:translate-x-0",
                (isCreating || selectedPrompt) ? "block" : "hidden md:block"
            )}>
                {/* Mobile back button */}
                <div className="md:hidden p-4 border-b border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                    >
                        <HiArrowLeft className="h-4 w-4" />
                        Back to Prompts
                    </Button>
                </div>

                <div className="max-w-3xl mx-auto p-6">
                    {(isCreating || selectedPrompt) && (
                        <PromptForm
                            key={selectedPrompt?.id || 'new'}
                            prompt={selectedPrompt}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsCreating(false)
                                setShowMobileForm(false)
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

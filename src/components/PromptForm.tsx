import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { usePromptStore } from '../store/usePromptStore'
import type { Prompt, PromptMessage } from '../types/prompt'
import {
    HiPlus,
    HiOutlineTrash,
    HiArrowUp,
    HiArrowDown
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAIModelsStore } from '../store/useAIModelsStore'
import { Badge } from './ui/badge'
import { AIModel } from '@/types/ai'

interface PromptFormProps {
    prompt?: Prompt | null
    onSave?: () => void
    onCancel?: () => void
}

interface ModelsByVendor {
    [key: string]: AIModel[]
}

export default function PromptForm({ prompt, onSave, onCancel }: PromptFormProps) {
    const [name, setName] = useState(prompt?.name || '')
    const [messages, setMessages] = useState<PromptMessage[]>(
        prompt?.prompt_data || [{ role: 'system', content: '' }]
    )
    const [selectedModels, setSelectedModels] = useState<string[]>(
        prompt?.allowed_models ? prompt.allowed_models.split(',') : []
    )
    const [isUpdating, setIsUpdating] = useState(false)
    const { createPrompt, updatePrompt, isCreating } = usePromptStore()
    const { models, fetchModels, isLoading: isLoadingModels } = useAIModelsStore()

    useEffect(() => {
        fetchModels()
    }, [fetchModels])

    const isSystemPrompt = prompt && !prompt.user_id

    const handleAddMessage = (role: 'system' | 'user' | 'assistant') => {
        setMessages([...messages, { role, content: '' }])
    }

    const handleRemoveMessage = (index: number) => {
        if (messages.length === 1) {
            toast.error('Prompt must have at least one message')
            return
        }
        const newMessages = messages.filter((_, i) => i !== index)
        setMessages(newMessages)
    }

    const handleMoveMessage = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === messages.length - 1)
        ) return

        const newMessages = [...messages]
        const newIndex = direction === 'up' ? index - 1 : index + 1
            ;[newMessages[index], newMessages[newIndex]] = [newMessages[newIndex], newMessages[index]]
        setMessages(newMessages)
    }

    const handleMessageChange = (index: number, content: string) => {
        const newMessages = messages.map((msg, i) =>
            i === index ? { ...msg, content } : msg
        )
        setMessages(newMessages)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Please enter a prompt name')
            return
        }
        if (messages.some(msg => !msg.content.trim())) {
            toast.error('All messages must have content')
            return
        }
        if (selectedModels.length === 0) {
            toast.error('Please select at least one model')
            return
        }

        try {
            setIsUpdating(true)
            const promptData = {
                name,
                prompt_data: messages,
                allowed_models: selectedModels.join(',')
            }

            if (prompt) {
                await updatePrompt(prompt.id, promptData)
                toast.success('Prompt updated successfully')
            } else {
                await createPrompt(promptData)
                toast.success('Prompt created successfully')
            }
            onSave?.()
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error(prompt ? 'Failed to update prompt' : 'Failed to create prompt')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleModelSelect = (modelId: string) => {
        if (modelId === 'local') {
            const fullId = 'local/local'
            if (!selectedModels.includes(fullId)) {
                setSelectedModels([...selectedModels, fullId])
            }
            return
        }

        const model = models.find(m => m.id === modelId)
        if (model) {
            const fullId = `${model.vendor.toLowerCase()}/${model.id}`
            if (!selectedModels.includes(fullId)) {
                setSelectedModels([...selectedModels, fullId])
            }
        }
    }

    const getModelDisplayName = (fullId: string): string => {
        if (fullId === 'local/local') {
            return 'Local Model'
        }

        const [vendor, modelId] = fullId.split('/')
        const model = models.find(m =>
            m.vendor.toLowerCase() === vendor &&
            m.id === modelId
        )
        return model ? `${model.name}` : fullId
    }

    // Group models by vendor and add Local option
    const modelsByVendor: ModelsByVendor = models.reduce((acc: ModelsByVendor, model) => {
        const vendor = model.vendor
        if (!acc[vendor]) {
            acc[vendor] = []
        }
        acc[vendor].push(model)
        return acc
    }, {
        'Local': [{
            id: 'local',
            name: 'Local Model',
            vendor: 'Local',
            description: 'Local LLM running on your machine',
            context_length: 4096,
            pricing: { prompt: '0', completion: '0' }
        }]
    } as ModelsByVendor)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    placeholder="Prompt name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSystemPrompt}
                />

                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between gap-2">
                            <Select
                                value={message.role}
                                onValueChange={(value: 'system' | 'user' | 'assistant') => {
                                    const newMessages = messages.map((msg, i) =>
                                        i === index ? { ...msg, role: value } : msg
                                    )
                                    setMessages(newMessages)
                                }}
                                disabled={isSystemPrompt}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="assistant">Assistant</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMoveMessage(index, 'up')}
                                    disabled={index === 0 || isSystemPrompt}
                                >
                                    <HiArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMoveMessage(index, 'down')}
                                    disabled={index === messages.length - 1 || isSystemPrompt}
                                >
                                    <HiArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveMessage(index)}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={isSystemPrompt}
                                >
                                    <HiOutlineTrash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Textarea
                            value={message.content}
                            onChange={(e) => handleMessageChange(index, e.target.value)}
                            placeholder={`Enter ${message.role} message...`}
                            className="min-h-[100px]"
                            disabled={isSystemPrompt}
                        />
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddMessage('system')}
                    className="flex items-center gap-2"
                    disabled={isSystemPrompt}
                >
                    <HiPlus className="h-4 w-4" />
                    System
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddMessage('user')}
                    className="flex items-center gap-2"
                    disabled={isSystemPrompt}
                >
                    <HiPlus className="h-4 w-4" />
                    User
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddMessage('assistant')}
                    className="flex items-center gap-2"
                    disabled={isSystemPrompt}
                >
                    <HiPlus className="h-4 w-4" />
                    Assistant
                </Button>
            </div>

            <div className="border-t pt-6 mt-6">
                <h3 className="font-medium mb-4">Available Models</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedModels.map((fullId) => (
                        <Badge
                            key={fullId}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1"
                        >
                            {getModelDisplayName(fullId)}
                            <button
                                type="button"
                                onClick={() => setSelectedModels(selectedModels.filter(id => id !== fullId))}
                                className="ml-1 hover:text-red-500"
                                disabled={isSystemPrompt}
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>

                <Select
                    disabled={isSystemPrompt || isLoadingModels}
                    onValueChange={handleModelSelect}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Show Local first */}
                        <div>
                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                                Local
                            </div>
                            <SelectItem
                                key="local"
                                value="local"
                                disabled={selectedModels.includes('local/local')}
                            >
                                Local Model (4096 tokens)
                            </SelectItem>
                        </div>

                        {/* Then show other vendors */}
                        {Object.entries(modelsByVendor)
                            .filter(([vendor]) => vendor !== 'Local') // Skip Local since we already showed it
                            .map(([vendor, vendorModels]) => (
                                <div key={vendor}>
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                                        {vendor}
                                    </div>
                                    {vendorModels.map((model) => (
                                        <SelectItem
                                            key={model.id}
                                            value={model.id}
                                            disabled={selectedModels.includes(`${vendor.toLowerCase()}/${model.id}`)}
                                        >
                                            {model.name} ({model.context_length} tokens)
                                        </SelectItem>
                                    ))}
                                </div>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                {!prompt && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                )}
                {!isSystemPrompt && (
                    <Button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1"
                    >
                        {isCreating || isUpdating ? 'Saving...' : prompt ? 'Update Prompt' : 'Create Prompt'}
                    </Button>
                )}
            </div>
        </form>
    )
}

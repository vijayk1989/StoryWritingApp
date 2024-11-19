import { useState } from 'react'
import { useLorebookStore } from '../store/useLorebookStore'

interface CreateLorebookItemFormProps {
    lorebookId: string
}

const CLASSIFICATIONS = ['Character', 'Item', 'Location'] as const
const LORE_TYPES = ['Background', 'Artifact', 'Spell', 'Protagonist', 'Antagonist', 'Plot', 'Other'] as const

export default function CreateLorebookItemForm({ lorebookId }: CreateLorebookItemFormProps) {
    const { createLorebookItem, isCreating } = useLorebookStore()
    const [isOpen, setIsOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        tags: '',
        classification: 'Character',
        lore_type: 'Background',
        description: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createLorebookItem({
                ...formData,
                lorebook_id: lorebookId
            })
            setFormData({
                name: '',
                tags: '',
                classification: 'Character',
                lore_type: 'Background',
                description: ''
            })
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to create lorebook item:', error)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg
                   text-gray-500 hover:border-gray-400 hover:text-gray-600
                   transition-colors duration-200"
            >
                + Add Lorebook Item
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="tag1, tag2, tag3"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="classification" className="block text-sm font-medium text-gray-700">
                            Classification
                        </label>
                        <select
                            id="classification"
                            value={formData.classification}
                            onChange={(e) => setFormData(prev => ({ ...prev, classification: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            {CLASSIFICATIONS.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lore_type" className="block text-sm font-medium text-gray-700">
                            Lore Type
                        </label>
                        <select
                            id="lore_type"
                            value={formData.lore_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, lore_type: e.target.value }))}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                       focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            {LORE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </form>
    )
}

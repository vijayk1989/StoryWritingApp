import { useState } from 'react'
import { useLorebookStore } from '../store/useLorebookStore'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent } from './ui/card'

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
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="w-full p-6 border-2 border-dashed bg-white hover:bg-white"
            >
                + Add Lorebook Item
            </Button>
        )
    }

    return (
        <Card className="bg-white">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="tag1, tag2, tag3"
                            className="bg-white border-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="classification">Classification</Label>
                            <Select
                                value={formData.classification}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}
                            >
                                <SelectTrigger className="bg-white border-gray-300">
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {CLASSIFICATIONS.map(classification => (
                                        <SelectItem
                                            key={classification}
                                            value={classification}
                                        >
                                            {classification}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lore_type">Lore Type</Label>
                            <Select
                                value={formData.lore_type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, lore_type: value }))}
                            >
                                <SelectTrigger className="bg-white border-gray-300">
                                    <SelectValue placeholder="Select lore type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {LORE_TYPES.map(type => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="min-h-[100px] bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useState, useEffect } from 'react'
import { useLorebookStore } from '../store/useLorebookStore'
import type { LorebookItem } from '../types/lorebook'
import toast from 'react-hot-toast'

const CLASSIFICATIONS = ['Character', 'Item', 'Location'] as const
const LORE_TYPES = ['Background', 'Artifact', 'Spell', 'Protagonist', 'Antagonist', 'Plot', 'Other'] as const

interface EditLorebookItemDialogProps {
    item: LorebookItem | null
    onClose: () => void
}

export default function EditLorebookItemDialog({ item, onClose }: EditLorebookItemDialogProps) {
    const { updateLorebookItem } = useLorebookStore()
    const [formData, setFormData] = useState({
        name: '',
        tags: '',
        classification: 'Character',
        lore_type: 'Background',
        description: ''
    })

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                tags: item.tags || '',
                classification: item.classification,
                lore_type: item.lore_type,
                description: item.description || ''
            })
        }
    }, [item])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!item) return

        try {
            await updateLorebookItem(item.id, {
                ...formData,
                lorebook_id: item.lorebook_id
            })
            toast.success('Item updated successfully')
            onClose()
        } catch (error) {
            toast.error('Failed to update item')
            console.error('Failed to update lorebook item:', error)
        }
    }

    return (
        <Dialog open={!!item} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-white text-gray-900">
                <DialogHeader>
                    <DialogTitle>Edit Lorebook Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter name"
                            className="bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tags (comma-separated)</Label>
                        <Input
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="tag1, tag2, tag3"
                            className="bg-white border-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Classification</Label>
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
                            <Label>Lore Type</Label>
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
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter description"
                            className="min-h-[150px] bg-white border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

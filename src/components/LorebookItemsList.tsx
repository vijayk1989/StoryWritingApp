import { useLorebookItems } from '../store/useLorebookStore'
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri'
import { useLorebookStore } from '../store/useLorebookStore'
import toast from 'react-hot-toast'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from './ui/accordion'
import { Button } from './ui/button'
import { useState } from 'react'
import EditLorebookItemDialog from './EditLorebookItemDialog'
import type { LorebookItem } from '../types/lorebook'

interface LorebookItemsListProps {
    lorebookId: string
}

export default function LorebookItemsList({ lorebookId }: LorebookItemsListProps) {
    const { data: items, error, isLoading } = useLorebookItems(lorebookId)
    const { deleteLorebookItem } = useLorebookStore()
    const [editingItem, setEditingItem] = useState<LorebookItem | null>(null)

    const handleDelete = async (id: string) => {
        try {
            await deleteLorebookItem(id, lorebookId)
            toast.success('Item deleted successfully')
        } catch (error) {
            toast.error('Failed to delete item')
            console.error('Error deleting item:', error)
        }
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading lorebook items</p>
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

    if (!items?.length) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No items in this lorebook yet.</p>
            </div>
        )
    }

    return (
        <>
            <Accordion type="single" collapsible className="space-y-4 mt-8">
                {items.map((item) => (
                    <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                        <div className="flex items-center px-6">
                            <div className="flex-1 flex items-center gap-4 py-4">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {item.classification}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingItem(item)
                                    }}
                                    className="text-gray-400 hover:text-blue-600"
                                    title="Edit item"
                                >
                                    <RiEditLine className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(item.id)
                                    }}
                                    className="text-gray-400 hover:text-red-600"
                                    title="Delete item"
                                >
                                    <RiDeleteBinLine className="w-5 h-5" />
                                </Button>
                                <AccordionTrigger className="hover:no-underline" />
                            </div>
                        </div>
                        <AccordionContent className="border-t px-6">
                            <div className="py-4 space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Type:</span>
                                    <span className="ml-2 text-sm text-gray-700">{item.lore_type}</span>
                                </div>
                                {item.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.split(',').map((tag, index) => (
                                            <span key={index} className="text-sm text-gray-500">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {item.description || 'No description provided.'}
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <EditLorebookItemDialog
                item={editingItem}
                onClose={() => setEditingItem(null)}
            />
        </>
    )
}

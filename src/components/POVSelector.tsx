import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { FaUserEdit } from "react-icons/fa"
import { useLorebookStore } from "@/store/useLorebookStore"
import type { SimplifiedLorebookItem } from "@/types/lorebook"
import { povSettingsDB } from "@/lib/indexedDB"

const POV_TYPES = [
    "First Person",
    "Third Person Limited",
    "Third Person Omniscient"
] as const

interface POVSelectorProps {
    chapterId: string
    storyId: string
}

export function POVSelector({
    chapterId,
    storyId,
}: POVSelectorProps) {
    const [povType, setPOVType] = useState<typeof POV_TYPES[number]>("Third Person Omniscient")
    const [povCharacter, setPOVCharacter] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [characters, setCharacters] = useState<SimplifiedLorebookItem[]>([])
    const { getCharactersByStoryId } = useLorebookStore()

    // Load POV settings from IndexedDB
    useEffect(() => {
        const loadPOVSettings = async () => {
            const settings = await povSettingsDB.getPOVSettings(chapterId)
            if (settings) {
                setPOVType(settings.pov_type as typeof POV_TYPES[number])
                setPOVCharacter(settings.pov_character)
            }
        }
        loadPOVSettings()
    }, [chapterId])

    // Load characters from lorebook
    useEffect(() => {
        const loadCharacters = async () => {
            const chars = await getCharactersByStoryId(storyId)
            setCharacters(chars)
        }
        loadCharacters()
    }, [storyId, getCharactersByStoryId])

    const handlePOVTypeChange = async (value: typeof POV_TYPES[number]) => {
        setPOVType(value)
        const newCharacter = value === "Third Person Omniscient" ? null : povCharacter
        setPOVCharacter(newCharacter)
        await povSettingsDB.setPOVSettings(chapterId, {
            pov_type: value,
            pov_character: newCharacter
        })
    }

    const handlePOVCharacterChange = async (value: string | null) => {
        setPOVCharacter(value)
        await povSettingsDB.setPOVSettings(chapterId, {
            pov_type: povType,
            pov_character: value
        })
        setIsEditing(false)
    }

    const getButtonLabel = () => {
        if (povType === "Third Person Omniscient") {
            return "POV: Omniscient"
        }
        return povCharacter ? `POV: ${povCharacter}` : "Set POV"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <FaUserEdit className="mr-2 h-4 w-4" />
                    {getButtonLabel()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>POV Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={povType} onValueChange={handlePOVTypeChange}>
                    {POV_TYPES.map((type) => (
                        <DropdownMenuRadioItem key={type} value={type}>
                            {type}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>

                {povType !== "Third Person Omniscient" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>POV Character</DropdownMenuLabel>

                        <DropdownMenuItem
                            className="text-muted-foreground"
                            onClick={() => handlePOVCharacterChange(null)}
                        >
                            None
                        </DropdownMenuItem>

                        {characters.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                {characters.map((char) => (
                                    <DropdownMenuItem
                                        key={char.name}
                                        onClick={() => handlePOVCharacterChange(char.name)}
                                    >
                                        {char.name}
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}

                        <DropdownMenuSeparator />
                        <div className="px-2 py-2">
                            {isEditing ? (
                                <Input
                                    value={povCharacter || ''}
                                    onChange={(e) => setPOVCharacter(e.target.value)}
                                    onBlur={() => handlePOVCharacterChange(povCharacter)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handlePOVCharacterChange(povCharacter)
                                        }
                                    }}
                                    placeholder="Custom character name..."
                                    className="h-8"
                                    autoFocus
                                />
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-8 px-2"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Custom character...
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

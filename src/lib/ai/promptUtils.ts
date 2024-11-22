import type { PromptMessage } from '../../types/prompt'
import type { LorebookItem } from '../../types/lorebook'
import { povSettingsDB } from '../../lib/indexedDB'

const MAX_PREVIOUS_WORDS = 1000

interface PromptContext {
    lorebookItems: LorebookItem[]
    summariesSoFar: string
    previousText: string
    sceneBeat: string
    povType: string
    povCharacter: string
}

export function formatPromptMessages(
    promptTemplate: PromptMessage[],
    context: PromptContext
): PromptMessage[] {
    return promptTemplate.map(msg => {
        let content = msg.content
        content = content.replace(/\/\*.*?\*\//gs, '')
        content = content
            .replace('{{lorebook_data}}', formatLorebookData(context.lorebookItems))
            .replace('{{summaries}}', context.summariesSoFar)
            .replace('{{previous_words}}', getLastNWords(context.previousText, MAX_PREVIOUS_WORDS))
            .replace('{{pov}}', context.povCharacter ? `${context.povType} (${context.povCharacter})` : context.povType)
            .replace('{{scenebeat}}', context.sceneBeat)

        return {
            role: msg.role,
            content: content.trim()
        }
    })
}

function formatLorebookData(items: LorebookItem[]): string {
    return items
        .map(item => `${item.name}: ${item.description}`)
        .join('\n\n')
}

function getLastNWords(text: string, n: number): string {
    const words = text.split(/\s+/)
    return words.slice(-n).join(' ')
}

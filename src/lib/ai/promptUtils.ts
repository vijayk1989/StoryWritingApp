import type { PromptMessage } from '../../types/prompt'
import type { LorebookItem } from '../../types/lorebook'

const MAX_PREVIOUS_WORDS = 1000

interface PromptContext {
    lorebookItems: LorebookItem[]
    summariesSoFar: string
    previousText: string
    sceneBeat: string
}

export function formatPromptMessages(
    promptTemplate: PromptMessage[],
    context: PromptContext
): PromptMessage[] {
    return promptTemplate.map(msg => {
        let content = msg.content

        // Remove comments
        content = content.replace(/\/\*.*?\*\//gs, '')

        // Replace placeholders
        content = content
            .replace('{{lorebook_data}}', formatLorebookData(context.lorebookItems))
            .replace('{{summaries}}', context.summariesSoFar)
            .replace('{{previous_words}}', getLastNWords(context.previousText, MAX_PREVIOUS_WORDS))
            .replace('{{pov}}', 'Third Person Omniscient')
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

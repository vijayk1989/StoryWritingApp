import { useEffect } from 'react'
import { useAISettingsStore, type Vendor } from '../store/useAISettingsStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent } from './ui/card'
import toast from 'react-hot-toast'

const VENDORS = ['OpenAI', 'Mistral', 'Claude', 'OpenRouter', 'Local'] as const

export default function AISettingsForm() {
    const { settings, loadSettings, updateSettings, isLoading } = useAISettingsStore()

    useEffect(() => {
        loadSettings()
    }, [loadSettings])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            await updateSettings({
                openai_key: formData.get('openai_key') as string,
                mistral_key: formData.get('mistral_key') as string,
                claude_key: formData.get('claude_key') as string,
                openrouter_key: formData.get('openrouter_key') as string,
                local_url: formData.get('local_url') as string,
                preferred_vendor: formData.get('preferred_vendor') as Vendor,
            })
            toast.success('Settings saved successfully')
        } catch (error) {
            toast.error('Failed to save settings')
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="space-y-4">
                        <div>
                            <Label>Preferred AI Vendor</Label>
                            <Select
                                name="preferred_vendor"
                                defaultValue={settings?.preferred_vendor || 'OpenAI'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {VENDORS.map((vendor) => (
                                        <SelectItem key={vendor} value={vendor}>
                                            {vendor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>OpenAI API Key</Label>
                            <Input
                                type="password"
                                name="openai_key"
                                defaultValue={settings?.openai_key || ''}
                                placeholder="sk-..."
                            />
                        </div>

                        <div>
                            <Label>Mistral API Key</Label>
                            <Input
                                type="password"
                                name="mistral_key"
                                defaultValue={settings?.mistral_key || ''}
                            />
                        </div>

                        <div>
                            <Label>Claude API Key</Label>
                            <Input
                                type="password"
                                name="claude_key"
                                defaultValue={settings?.claude_key || ''}
                            />
                        </div>

                        <div>
                            <Label>OpenRouter API Key</Label>
                            <Input
                                type="password"
                                name="openrouter_key"
                                defaultValue={settings?.openrouter_key || ''}
                            />
                        </div>

                        <div>
                            <Label>Local API URL</Label>
                            <Input
                                type="url"
                                name="local_url"
                                defaultValue={settings?.local_url || ''}
                                placeholder="http://localhost:1234"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Save Settings
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

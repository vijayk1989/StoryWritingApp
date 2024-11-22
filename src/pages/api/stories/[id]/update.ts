import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request, params, cookies }) => {
    try {
        const { id } = params;
        const formData = await request.formData();
        const title = formData.get("title")?.toString();
        const language = formData.get("language")?.toString();
        const author = formData.get("author")?.toString();

        const accessToken = cookies.get("sb-access-token");
        const refreshToken = cookies.get("sb-refresh-token");

        if (!accessToken || !refreshToken) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401
            });
        }

        if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400
            });
        }

        const { data, error } = await supabase
            .from('stories')
            .update({
                title,
                language,
                author
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 200
        });

    } catch (error) {
        console.error('Error updating story:', error);
        return new Response(JSON.stringify({ error: 'Failed to update story' }), {
            status: 500
        });
    }
};

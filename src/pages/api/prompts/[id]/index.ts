import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { name, prompt_data, allowed_models } = body;

        const accessToken = cookies.get("sb-access-token");
        const refreshToken = cookies.get("sb-refresh-token");

        if (!accessToken || !refreshToken) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401
            });
        }

        await supabase.auth.setSession({
            refresh_token: refreshToken.value,
            access_token: accessToken.value,
        });

        const updateData: any = {};
        if (name) updateData.name = name;
        if (prompt_data) updateData.prompt_data = prompt_data;
        if (allowed_models !== undefined) updateData.allowed_models = allowed_models;

        const { data, error } = await supabase
            .from('prompts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 200
        });
    } catch (error) {
        console.error('Error updating prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to update prompt' }), {
            status: 500
        });
    }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
    try {
        const { id } = params;

        const accessToken = cookies.get("sb-access-token");
        const refreshToken = cookies.get("sb-refresh-token");

        if (!accessToken || !refreshToken) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401
            });
        }

        await supabase.auth.setSession({
            refresh_token: refreshToken.value,
            access_token: accessToken.value,
        });

        const { error } = await supabase
            .from('prompts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return new Response(null, {
            status: 204
        });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete prompt' }), {
            status: 500
        });
    }
};

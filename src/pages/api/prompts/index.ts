import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
    try {
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

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 401
            });
        }

        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch prompts' }), {
            status: 500
        });
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
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

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 401
            });
        }

        const { data, error } = await supabase
            .from('prompts')
            .insert([{
                name,
                prompt_data,
                allowed_models,
                user_id: user.id
            }])
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 200
        });
    } catch (error) {
        console.error('Error creating prompt:', error);
        return new Response(JSON.stringify({ error: 'Failed to create prompt' }), {
            status: 500
        });
    }
};

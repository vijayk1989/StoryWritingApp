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
            .from('stories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            status: 200
        });

    } catch (error) {
        console.error('Error fetching stories:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch stories' }), {
            status: 500
        });
    }
};

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const language = formData.get("language")?.toString() || "English";
    const author = formData.get("author")?.toString();

    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401
      });
    }

    // Set the session first
    await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!title || !user) {
      return new Response(JSON.stringify({ error: 'Missing title or user' }), {
        status: 400
      });
    }

    const { data, error } = await supabase
      .from('stories')
      .insert([{
        title,
        language,
        author,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200
    });

  } catch (error) {
    console.error('Error creating story:', error);
    return new Response(JSON.stringify({ error: 'Failed to create story' }), {
      status: 500
    });
  }
};

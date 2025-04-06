import { supabase } from "../../config/supabase";
import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const categoryId = query.categoryId as string;

    console.log('🔍 Fetching posts with categoryId:', categoryId);

    let postsQuery = supabase
      .from('posts')
      .select(`
        *,
        posts_categories!inner(
          category_id,
          categories(
            id,
            name
          )
        )
      `);

    if (categoryId) {
      console.log('📌 Applying category filter:', categoryId);
      postsQuery = postsQuery.eq('posts_categories.category_id', categoryId);
    }

    const { data: posts, error: supabaseError } = await postsQuery
      .order('created_at', { ascending: false });

    console.log('📝 Query result:', {
      postsCount: posts?.length,
      firstPost: posts?.[0],
      categoryId
    });

    if (supabaseError) {
      console.error('❌ Database query failed:', supabaseError);
      return {
        statusCode: 400,
        message: "Database query failed",
        error: supabaseError.message,
      };
    }

    return {
      posts,
      message: "Posts fetched successfully",
    };
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
import { supabase } from "../../config/supabase";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const { data: posts, error: supabaseError } = await supabase
      .from("posts")
      .select("*");

    // Supabaseのエラーハンドリング
    if (supabaseError) {
      return {
        statusCode: 400,
        message: "Database query failed",
        error: supabaseError.message
      };
    }

    return {
      posts,
      message: "Posts fetched successfully",
    };

  } catch (error) {
    // 予期せぬエラーのハンドリング
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}); 
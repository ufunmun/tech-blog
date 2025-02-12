import { defineEventHandler } from "h3";
import { supabase } from "../../config/supabase";

export default defineEventHandler(async (event) => {
  // デバッグ用のログ
  console.log("API endpoint called");

  try {
    // Supabaseから記事一覧を取得
    const { data: posts, error } = await supabase.from("posts").select("*");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // デバッグ用のログ
    console.log("Posts retrieved:", posts);

    return {
      posts,
      message: "Posts fetched successfully",
    };
  } catch (error) {
    console.error("Error in API handler:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch posts",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

import { defineEventHandler } from "h3";
import { supabase } from "../../config/supabase";

export default defineEventHandler(async (event) => {
  try {
    const { data: posts, error } = await supabase.from("posts").select("*");

    if (error) {
      throw error;
    }

    return {
      posts,
      message: "Posts fetched successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to fetch posts",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

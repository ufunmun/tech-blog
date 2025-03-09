import { defineEventHandler } from "h3";
import { supabase } from "../../config/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if(!id || typeof id !== "string") {
      return {
        statusCode: 400,
        message: "Post ID is required",
        error: "Missing post ID"
      };
    }

    // 先に記事の存在確認を行う
    const { data: existingPost } = await supabase
      .from("posts")
      .select()
      .eq("id", id)
      .single();

    if (!existingPost) {
      return {
        statusCode: 404,
        message: "Post not found",
        error: "The specified post does not exist",
      };
    }

    // 記事が存在することを確認してから削除を実行
    const { error: supabaseError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if(supabaseError) {
      return {
        statusCode: 400,
        message: "Database query failed",
        error: (supabaseError as PostgrestError).message,
      };
    }

    return {
      statusCode: 200,
      message: "Post deleted successfully"
    }

  } catch(error) {
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
})
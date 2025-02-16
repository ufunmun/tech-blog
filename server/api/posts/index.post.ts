import { defineEventHandler, readBody } from "h3";
import { supabase } from "../../config/supabase";
import { PostgrestError} from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
    try {
        // リクエストボディを取得
        const body = await readBody(event);

        // バリデーション
        if(!body.title || typeof body.title !== 'string'){
            return {
                statusCode: 400,
                message: "Title is required",
                error: "Title must be a string"
            };
        }

        if (!body.content || typeof body.content !== 'string'){
            return {
                statusCode: 400,
                message: "Content is required",
                error: "Content must be a string"
            };
        }

        // 記事データを作成
        const { data: post, error: supabaseError } = await supabase
            .from("posts")
            .insert([
                {
                    title: body.title,
                    content: body.content,
                    status: 'draft', // デフォルトはドラフト状態
                    user_id: 'f5bbf350-0de4-1dc8-d895-fc59e2651361'
                }
            ])
            .select()
            .single();

        // Supabaseのエラーハンドリング
        if(supabaseError){
            return {
                statusCode: 400,
                message: "Failed to create post",
                error: (supabaseError as PostgrestError).message
            };
        }

        return {
            post,
            message: "Post created successfully"
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
});
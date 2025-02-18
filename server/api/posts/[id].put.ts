// 記事を更新するAPI
import { defineEventHandler, readBody } from 'h3';
import { supabase } from "../../config/supabase";
import { PostgrestError } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    try {
        // パラメータとリクエストボディを取得
        const id = event.context.params?.id;
        const body = await readBody(event);

        // IDのバリデーション
        if(!id || typeof id !== 'string'){
            return {
                statusCode: 400,
                message: "Post ID is required",
                error: "Missing post ID"
            };
        }

        // UUIDの形式チェック
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if(!uuidRegex.test(id)){
            return {
                statusCode: 400,
                message: "Invalid post ID format",
                error: "Post ID must be a valid UUID"
            };
        }

        // リクエストボディのバリデーション
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

        // 記事の更新
        const { data, error: supabaseError } = await supabase
            .from('posts')
            .update({
                title: body.title,
                content: body.content,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        const post = data?.[0];

        // エラーハンドリング
        if(supabaseError){
            return {
                statusCode: 400,
                message: "Failed to update post",
                error: (supabaseError as PostgrestError).message
            };
        }

        // 記事が見つからない場合
        if(!post){
            return {
                statusCode: 404,
                message: "Post not found",
                error: "The specified post does not exist"
            };
        }

        // 成功時のレスポンス
        return {
            post,
            message: "Post updated successfully"
        };

    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
});
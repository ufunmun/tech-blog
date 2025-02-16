// 記事の詳細を取得するAPI
import { defineEventHandler } from "h3";
import { supabase } from "../../config/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
    try {
        // クエリパラメータから記事のIDを取得
        const id = event.context.params?.id;

        // 記事のIDが指定されていない、または文字列でない場合はエラーレスポンスを返す
        if (!id || typeof id !== 'string') {
            return {
                statusCode: 400,
                message: "Post ID is required",
                error: "Missing post ID"
            };
        }

        // IDの形式チェックを追加（UUIDの簡易チェック）
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return {
                statusCode: 400,
                message: "Invalid post ID format",
                error: "Post ID must be a valid UUID"
            };
        }

        // Supabaseから記事データを取得
        const { data: post, error: supabaseError } = await supabase
            .from("posts")
            .select(`
                id,
                title,
                content,
                status,
                created_at,
                updated_at,
                user_id
            `)
            .eq("id", id)
            .single();

        // エラーが発生した場合はエラーレスポンスを返す
        if (supabaseError) {
            return {
                statusCode: 400,
                message: "Database query failed",
                error: (supabaseError as PostgrestError).message
            };
        }

        // 記事データが存在しない場合はエラーレスポンスを返す
        if (!post) {
            return {
                statusCode: 404,
                message: "Post not found",
                error: "The specified post does not exist"
            };
        }

        // 記事データを返す
        return {
            post,
            message: "Post fetched successfully"
        };

    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
});
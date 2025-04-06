import { defineEventHandler, readBody } from "h3";
import { supabase } from "../../config/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('📝 Received request body:', body);  // リクエストボディの確認

    // バリデーション
    if (!body.title || typeof body.title !== "string") {
      console.log('❌ Validation failed: Invalid title');
      return {
        statusCode: 400,
        message: "Title is required",
        error: "Title must be a string",
      };
    }

    if (!body.content || typeof body.content !== "string") {
      console.log('❌ Validation failed: Invalid content');
      return {
        statusCode: 400,
        message: "Content is required",
        error: "Content must be a string",
      };
    }

    // 記事データを作成
    console.log('📌 Creating post with data:', {
      title: body.title,
      content: body.content.substring(0, 50) + '...', // コンテンツは長いかもしれないので省略
      status: "published",
      user_id: "f5bbf350-0de4-1dc8-d895-fc59e2651361",
    });

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          title: body.title,
          content: body.content,
          status: "published",
          user_id: "f5bbf350-0de4-1dc8-d895-fc59e2651361",
        },
      ])
      .select()
      .single();

    // 記事作成のエラーハンドリング
    if (postError) {
      console.error('❌ Failed to create post:', postError);
      return {
        statusCode: 400,
        message: "Failed to create post",
        error: (postError as PostgrestError).message,
      };
    }

    console.log('✅ Post created successfully:', post);

    // カテゴリーが選択されている場合、posts_categoriesテーブルに紐付けを作成
    if (body.categoryId && post) {
      console.log('📌 Linking post to category:', {
        post_id: post.id,
        category_id: body.categoryId,
        post: post  // 投稿データ全体も確認
      });

      const { data: linkData, error: categoryError } = await supabase  // dataを取得するように変更
        .from("posts_categories")
        .insert([
          {
            post_id: post.id,
            category_id: body.categoryId,
          },
        ])
        .select();  // 結果を確認するためにselect追加

      console.log('📝 Category link result:', {
        data: linkData,
        error: categoryError,
        sql: `INSERT INTO posts_categories (post_id, category_id) VALUES ('${post.id}', '${body.categoryId}')`  // 実行されるSQLのイメージ
      });

      if (categoryError) {
        console.error('❌ Failed to link category:', {
          error: categoryError,
          errorMessage: categoryError.message,
          errorDetails: categoryError.details,
          errorHint: categoryError.hint
        });
        return {
          statusCode: 400,
          message: "Failed to link category",
          error: (categoryError as PostgrestError).message,
        };
      }

      console.log('✅ Category linked successfully', {
        linkData,
        post_id: post.id,
        category_id: body.categoryId
      });
    } else {
      console.log('ℹ️ No category to link', {
        body_categoryId: body.categoryId,
        post: post
      });
    }

    return {
      post,
      message: "Post created successfully",
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
// Supabaseのクライアントを作成するための関数をインポート
import { createClient } from "@supabase/supabase-js";

// .envファイルから環境変数を読み込み、文字列型として型アサーション
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

// 環境変数が読み込めない場合はエラーを投げる
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Supabaseクライアントのインスタンスを作成し、エクスポート
// このクライアントを通じてSupabaseのデータベースやAPI機能にアクセスできる
export const supabase = createClient(supabaseUrl, supabaseKey);

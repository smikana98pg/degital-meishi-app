import { createClient } from "@supabase/supabase-js";

// バッチ処理用クライアント
// service role key を使用することで RLS・GRANT 制限を無視して削除できる
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

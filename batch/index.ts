import { createClient } from "@supabase/supabase-js";

// バッチ処理はRLSを無視する service role key を使用する（anon keyでは削除権限がない）
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// JST（UTC+9）で「昨日」の開始・終了をUTCに変換して取得する
function getYesterdayRangeUTC(): { start: string; end: string } {
  // JSTはUTC+9のため9時間をミリ秒に変換
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  // 現在時刻（UTC）に9時間を足して日本時間を算出
  const nowJST = new Date(Date.now() + JST_OFFSET_MS);

  // 昨日の00:00 JST（削除範囲の開始）
  const yesterdayStartJST = new Date(nowJST);
  yesterdayStartJST.setUTCDate(nowJST.getUTCDate() - 1); // 日付を1日前に設定
  yesterdayStartJST.setUTCHours(0, 0, 0, 0); // 時刻を00:00:00にリセット

  // 今日の00:00 JST（削除範囲の終端。この時刻より前が昨日）
  const yesterdayEndJST = new Date(nowJST);
  yesterdayEndJST.setUTCHours(0, 0, 0, 0);

  return {
    // JST→UTCに戻すため9時間を引いてISO文字列に変換（DBはUTCで保存されているため）
    start: new Date(yesterdayStartJST.getTime() - JST_OFFSET_MS).toISOString(),
    end: new Date(yesterdayEndJST.getTime() - JST_OFFSET_MS).toISOString(),
  };
}

async function deletePreviousDayData(): Promise<void> {
  const { start, end } = getYesterdayRangeUTC();
  console.log(`削除対象期間（UTC）: ${start} 〜 ${end}`);

  // user_skill を先に削除（外部キー制約があるため子テーブルを先に削除）
  const { error: skillError } = await supabase
    .from("user_skill")
    .delete()
    .gte("created_at", start)
    .lt("created_at", end);

  if (skillError) {
    console.error("user_skill の削除に失敗しました:", skillError.message);
    process.exit(1);
  }
  console.log("user_skill の削除が完了しました");

  // users を削除
  const { error: userError } = await supabase
    .from("users")
    .delete()
    .gte("created_at", start)
    .lt("created_at", end);

  if (userError) {
    console.error("users の削除に失敗しました:", userError.message);
    process.exit(1);
  }
  console.log("users の削除が完了しました");
}

deletePreviousDayData();

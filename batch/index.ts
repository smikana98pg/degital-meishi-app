// dotenv/config を最初に import することで、他のモジュールより先に .env が読み込まれる
import "dotenv/config";
import { supabase } from "./supabase";

// 前日作成したusersとuser_skillを削除する
const deleteUser = async () => {
  console.log("削除処理を開始します");
  try {
    await deleteData();
    console.log("削除しました");
  } catch (e) {
    console.error("削除に失敗しました:", e);
    process.exit(1);
  }
};

async function deleteData() {
  const now = new Date();
  const JST_OFFSET = 9 * 60 * 60 * 1000; // 日本時間 (UTC+9) のオフセット
  const yesterday = new Date(now.getTime() + JST_OFFSET - 24 * 60 * 60 * 1000);

  // 日本時間で昨日の開始時刻と終了時刻を UTC 時間に変換
  const startOfYesterday = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate(),
      0,
      0,
      0,
    ),
  ).toISOString();

  // 今日の00:00:00 UTC（昨日の終端として .lt で使用する）
  const endOfYesterday = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  ).toISOString();

  // user_skill を先に削除（外部キー制約があるため子テーブルを先に削除）
  const { error: userSkillError } = await supabase
    .from("user_skill")
    .delete()
    .gte("created_at", startOfYesterday)
    .lt("created_at", endOfYesterday);

  if (userSkillError) {
    throw new Error(userSkillError.message);
  }

  // users を削除
  const { error } = await supabase
    .from("users")
    .delete()
    .gte("created_at", startOfYesterday)
    .lt("created_at", endOfYesterday);

  if (error) {
    throw new Error(error.message);
  }
}

deleteUser();

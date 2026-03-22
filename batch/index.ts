// dotenv/config を最初に import することで、他のモジュールより先に .env が読み込まれる
import "dotenv/config";
// import { supabase } from "../src/utils/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.URL!, process.env.KEY!);

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
  // JSTで「今日の0時」をUTC換算し、それより前に作成されたデータを削除する
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const nowJST = new Date(Date.now() + JST_OFFSET_MS);
  const todayJSTStartUTC = new Date(
    Date.UTC(
      nowJST.getUTCFullYear(),
      nowJST.getUTCMonth(),
      nowJST.getUTCDate(),
    ).valueOf() - JST_OFFSET_MS,
  );

  // user_skillを先に削除（外部キー制約のため）
  const { error: skillError } = await supabase
    .from("user_skill")
    .delete()
    .lt("created_at", todayJSTStartUTC.toISOString());

  if (skillError) {
    throw new Error(skillError.message);
  }

  // usersを削除
  const { error: userError } = await supabase
    .from("users")
    .delete()
    .lt("created_at", todayJSTStartUTC.toISOString());

  if (userError) {
    throw new Error(userError.message);
  }
}

deleteUser();

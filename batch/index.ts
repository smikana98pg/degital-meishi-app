// dotenv/config を最初に import することで、他のモジュールより先に .env が読み込まれる
import "dotenv/config";
import { supabase } from "../src/utils/supabase";

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
  // SECURITY DEFINER で定義したDB関数をRPC経由で呼び出す
  // anon keyでも実行可能で、日付計算・削除処理はDB側で完結する
  const { error } = await supabase.rpc(
    "delete_users_and_user_skill_of_previous_day",
    {},
  );

  if (error) {
    throw new Error(error.message);
  }
}

deleteUser();

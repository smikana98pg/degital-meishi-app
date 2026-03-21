// dotenv/config を最初に import することで、他のモジュールより先に .env が読み込まれる
import "dotenv/config";
import { deleteData } from "../src/utils/supabaseFunctions";

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

deleteUser();
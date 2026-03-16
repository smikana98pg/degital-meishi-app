import { User } from "../domain/user";
import { supabase } from "../utils/supabase";

//データ取得関数
export async function getUserData(userId: string | undefined): Promise<User[]> {
  const response = await supabase
    .from("degital-meishi")
    .select()
    .eq("user_id", userId);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const users = response.data.map((row) => {
    return User.newUser(
      row.user_id,
      row.name,
      row.description,
      row.github_id,
      row.qiita_id,
      row.x_id,
      row.created_at,
    );
  });

  return users;
}

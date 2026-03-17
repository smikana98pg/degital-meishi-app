import { User } from "../domain/user";
import { supabase } from "../utils/supabase";

//データ取得関数
export async function getUserData(
  userId: string | undefined,
): Promise<User | null> {
  // usersテーブルを基点に、外部キーを使って以下を結合
  // user_skill（中間テーブル）→ skills（スキルテーブル）のnameのみ取得
  // SQLに相当: SELECT users.*, skills.name FROM users
  //            JOIN user_skill ON users.user_id = user_skill.user_id
  //            JOIN skills ON user_skill.skill_id = skills.id
  //            WHERE users.user_id = ?
  const response = await supabase
    .from("users")
    .select("*, user_skill(skills(name))")
    .eq("user_id", userId)
    .single();

  if (response.error) {
    return null;
  }

  const user = response.data;
  // user_skillはネストした配列で返るため、skills.nameだけを取り出す
  // 例: [{ skills: { name: "React" } }] → ["React"]
  const skills = user.user_skill.map(
    // : { skills: { name: string } } → us の型定義
    (us: { skills: { name: string } }) => us.skills.name,
  );
  return User.newUser(
    user.user_id,
    user.name,
    user.description,
    user.github_id,
    user.qiita_id,
    user.x_id,
    user.created_at,
    skills,
  );
}

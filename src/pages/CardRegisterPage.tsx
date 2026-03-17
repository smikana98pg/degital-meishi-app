import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getSkillsData,
  insertUserData,
  insertUserSkillData,
} from "@/repositories/user";
import type { Skill } from "@/domain/skill";
import {
  Box,
  Flex,
  Heading,
  Field,
  Input,
  Textarea,
  Button,
  NativeSelect,
} from "@chakra-ui/react";

// フォームの型定義
type FormData = {
  user_id: string;
  name: string;
  description: string;
  skill_id: number;
  github_id: string;
  qiita_id: string;
  x_id: string;
};

export const CardRegisterPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register, // 入力フィールドを登録する関数
    handleSubmit, // バリデーション通過後に実行する関数
    reset, // フォームをリセットする関数
    formState: { errors }, // バリデーションエラー情報
  } = useForm<FormData>({
    defaultValues: {
      user_id: "",
      name: "",
      description: "",
      skill_id: 0,
      github_id: "",
      qiita_id: "",
      x_id: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const skillsData = await getSkillsData();
      setSkills(skillsData);
    };
    fetchUser();
  }, []);

  // 登録ボタン押下時処理
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await insertUserData(
        data.user_id,
        data.name,
        data.description,
        data.github_id,
        data.qiita_id,
        data.x_id,
      );
      await insertUserSkillData(data.user_id, data.skill_id);
      reset();
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" minH="100vh">
      <Box textAlign="center">
        <Heading as="h1" size="3xl" mb={6}>
          名刺新規登録
        </Heading>
        <Box bg="white" rounded="lg" shadow="md" p={6} w="320px">
          <Field.Root>
            {/* ID入力 */}
            <Field.Label>
              ID <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type="text"
              {...register("user_id", {
                required: "IDの入力は必須です",
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "英字のみ入力可能です",
                },
              })}
            />
            {errors.user_id && (
              <Box color="red.500" fontSize="sm">
                {errors.user_id.message}
              </Box>
            )}
            {/* 名前入力 */}
            <Field.Label>
              名前 <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type="text"
              {...register("name", {
                required: "名前の入力は必須です",
              })}
            />
            {errors.name && (
              <Box color="red.500" fontSize="sm">
                {errors.name.message}
              </Box>
            )}
            {/* 自己紹介入力 */}
            <Field.Label>
              自己紹介 <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Textarea
              {...register("description", {
                required: "自己紹介の入力は必須です",
              })}
              placeholder="<h1>HTMLタグを使えます</h1>"
            />
            {errors.description && (
              <Box color="red.500" fontSize="sm">
                {errors.description.message}
              </Box>
            )}
            {/* 好きな技術選択 */}
            <Field.Label>
              好きな技術 <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                placeholder="Select Option"
                {...register("skill_id", {
                  required: "好きな技術の選択は必須です",
                  valueAsNumber: true,
                })}
              >
                {skills?.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            {errors.skill_id && (
              <Box color="red.500" fontSize="sm">
                {errors.skill_id.message}
              </Box>
            )}
            {/* Github入力 */}
            <Field.Label>Github</Field.Label>
            <Input type="text" {...register("github_id")} />
            {/* Qiita入力 */}
            <Field.Label>Qiita</Field.Label>
            <Input type="text" {...register("qiita_id")} />
            {/* X入力 */}
            <Field.Label>X</Field.Label>
            <Input
              type="text"
              placeholder="@は不要です"
              {...register("x_id")}
            />
            {/* 登録ボタン */}
            <Button
              colorPalette="teal"
              fontWeight="bold"
              width="full"
              mt={2}
              onClick={handleSubmit(onSubmit)}
              loading={isLoading}
            >
              登録
            </Button>
          </Field.Root>
        </Box>
      </Box>
    </Flex>
  );
};

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import DOMPurify from "dompurify";
import {
  getSkillsData,
  insertUserData,
  insertUserSkillData,
  checkUserIdExists,
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
} from "@chakra-ui/react";

// フォームの型定義
type FormData = {
  user_id: string;
  name: string;
  description: string;
  skill_ids: number[];
  github_id: string;
  qiita_id: string;
  x_id: string;
};

export const CardRegisterPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      user_id: "",
      name: "",
      description: "",
      skill_ids: [],
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
      const sanitizedDescription = DOMPurify.sanitize(data.description);
      await insertUserData(
        data.user_id,
        data.name,
        sanitizedDescription,
        data.github_id,
        data.qiita_id,
        data.x_id,
      );
      await insertUserSkillData(data.user_id, data.skill_ids);
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
                minLength: {
                  value: 3,
                  message: "IDは3文字以上で入力してください",
                },
                maxLength: {
                  value: 20,
                  message: "IDは20文字以内で入力してください",
                },
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "英字のみ入力可能です",
                },
                validate: {
                  notReserved: (v) =>
                    v !== "register" || '"register" は使用できません',
                  notDuplicate: async (v) =>
                    !(await checkUserIdExists(v)) ||
                    "このIDは既に使用されています",
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
                maxLength: {
                  value: 50,
                  message: "名前は50文字以内で入力してください",
                },
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
                maxLength: {
                  value: 500,
                  message: "自己紹介は500文字以内で入力してください",
                },
              })}
              placeholder="自己紹介を入力してください"
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
            <Controller
              name="skill_ids"
              control={control}
              rules={{
                validate: (v) =>
                  v.length > 0 || "好きな技術を1つ以上選択してください",
              }}
              render={({ field }) => (
                <ReactSelect
                  isMulti
                  options={
                    skills?.map((s) => ({ label: s.name, value: s.id })) ?? []
                  }
                  value={skills
                    ?.filter((s) => field.value.includes(s.id))
                    .map((s) => ({ label: s.name, value: s.id }))}
                  onChange={(selected) => {
                    field.onChange(selected.map((s) => s.value));
                  }}
                  placeholder="技術を選択（複数可）"
                  styles={{
                    container: (base) => ({
                      ...base,
                      width: "100%",
                      textAlign: "left",
                    }),
                  }}
                />
              )}
            />
            {errors.skill_ids && (
              <Box color="red.500" fontSize="sm">
                {errors.skill_ids.message}
              </Box>
            )}
            {/* Github入力 */}
            <Field.Label>Github</Field.Label>
            <Input
              type="text"
              {...register("github_id", {
                maxLength: {
                  value: 50,
                  message: "Githubは50文字以内で入力してください",
                },
              })}
            />
            {errors.github_id && (
              <Box color="red.500" fontSize="sm">
                {errors.github_id.message}
              </Box>
            )}
            {/* Qiita入力 */}
            <Field.Label>Qiita</Field.Label>
            <Input
              type="text"
              {...register("qiita_id", {
                maxLength: {
                  value: 50,
                  message: "Qiitaは50文字以内で入力してください",
                },
              })}
            />
            {errors.qiita_id && (
              <Box color="red.500" fontSize="sm">
                {errors.qiita_id.message}
              </Box>
            )}
            {/* X入力 */}
            <Field.Label>X</Field.Label>
            <Input
              type="text"
              placeholder="@は不要です"
              {...register("x_id", {
                maxLength: {
                  value: 50,
                  message: "Xは50文字以内で入力してください",
                },
              })}
            />
            {errors.x_id && (
              <Box color="red.500" fontSize="sm">
                {errors.x_id.message}
              </Box>
            )}
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

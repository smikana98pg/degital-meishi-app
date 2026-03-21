import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { render } from "./test-utils";
import { CardRegisterPage } from "../pages/CardRegisterPage";

// useNavigateをモック（登録後の navigate("/") 呼び出しを検証するため）
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Supabase関数をモック（実際のDB呼び出しをしないようにする）
const mockGetSkillsData = jest.fn();
const mockInsertUserData = jest.fn();
const mockInsertUserSkillData = jest.fn();

jest.mock("@/repositories/user", () => ({
  getSkillsData: () => mockGetSkillsData(),
  insertUserData: (...args: unknown[]) => mockInsertUserData(...args),
  insertUserSkillData: (...args: unknown[]) => mockInsertUserSkillData(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSkillsData.mockResolvedValue([{ id: 1, name: "React" }]);
  mockInsertUserData.mockResolvedValue(undefined);
  mockInsertUserSkillData.mockResolvedValue(undefined);
});

describe("名刺登録ページ", () => {
  test("タイトルが表示されている", async () => {
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );
    // getSkillsData の非同期処理が完了するまで待つ
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    expect(screen.getByText("名刺新規登録")).toBeInTheDocument();
  });

  test("全項目入力して登録ボタンを押すと / に遷移する", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );

    // register("field_name") が name 属性を設定するため、name で要素を取得
    await user.type(
      document.querySelector('input[name="user_id"]') as HTMLElement,
      "testuser",
    );
    await user.type(
      document.querySelector('input[name="name"]') as HTMLElement,
      "テスト太郎",
    );
    await user.type(
      document.querySelector('textarea[name="description"]') as HTMLElement,
      "テストの紹介文",
    );

    // getSkillsData が非同期のため、オプションが描画されるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByRole("combobox"), "1");

    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("IDがないときにエラーメッセージがでる", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "登録" }));
    expect(await screen.findByText("IDの入力は必須です")).toBeInTheDocument();
  });

  test("名前がないときにエラーメッセージがでる", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    await user.type(
      document.querySelector('input[name="user_id"]') as HTMLElement,
      "testuser",
    );
    await user.click(screen.getByRole("button", { name: "登録" }));
    expect(await screen.findByText("名前の入力は必須です")).toBeInTheDocument();
  });

  test("紹介文がないときにエラーメッセージがでる", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    await user.type(
      document.querySelector('input[name="user_id"]') as HTMLElement,
      "testuser",
    );
    await user.type(
      document.querySelector('input[name="name"]') as HTMLElement,
      "テスト太郎",
    );
    await user.click(screen.getByRole("button", { name: "登録" }));
    expect(await screen.findByText("自己紹介の入力は必須です")).toBeInTheDocument();
  });

  test("オプション（Github/Qiita/X）を入力しなくても登録ができる", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CardRegisterPage />
      </MemoryRouter>,
    );

    await user.type(
      document.querySelector('input[name="user_id"]') as HTMLElement,
      "testuser",
    );
    await user.type(
      document.querySelector('input[name="name"]') as HTMLElement,
      "テスト太郎",
    );
    await user.type(
      document.querySelector('textarea[name="description"]') as HTMLElement,
      "テストの紹介文",
    );

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "React" })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByRole("combobox"), "1");

    await user.click(screen.getByRole("button", { name: "登録" }));

    // github_id/qiita_id/x_id が空文字で登録されることを確認
    await waitFor(() => {
      expect(mockInsertUserData).toHaveBeenCalledWith(
        "testuser",
        "テスト太郎",
        "テストの紹介文",
        "",
        "",
        "",
      );
    });
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { render } from "./test-utils";
import { UserCard } from "../components/UserCard";
import { User } from "../domain/user";

// useNavigateをモック（戻るボタンの navigate() 呼び出しを検証するため）
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// User.newUser はgithub_id等をURL形式に変換するため、テスト用ユーザーのIDはそのままの値を使う
// 例: "testgithub" → "https://github.com/testgithub"
const mockUser = User.newUser(
  "testid",
  "テストユーザー",
  "テストの自己紹介",
  "testgithub",
  "testqiita",
  "testx",
  "2025-01-01T00:00:00.000Z",
  ["React", "TypeScript"],
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("名刺カード", () => {
  test("名前が表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
  });

  test("自己紹介が表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    expect(screen.getByText("テストの自己紹介")).toBeInTheDocument();
  });

  test("技術が表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
  });

  test("Githubアイコンが表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    // User.newUser が "testgithub" → "https://github.com/testgithub" に変換する
    expect(
      document.querySelector('a[href="https://github.com/testgithub"]'),
    ).toBeInTheDocument();
  });

  test("Qiitaのアイコンが表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    expect(
      document.querySelector('a[href="https://qiita.com/testqiita"]'),
    ).toBeInTheDocument();
  });

  test("Twitterのアイコンが表示されている", () => {
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    expect(
      document.querySelector('a[href="https://x.com/testx"]'),
    ).toBeInTheDocument();
  });

  test("戻るボタンをクリックすると / に遷移する", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "戻る" }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

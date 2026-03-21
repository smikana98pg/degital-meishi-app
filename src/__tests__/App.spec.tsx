import App from "../App";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { render } from "./test-utils";

// useNavigateをモック（SearchCardの navigate() 呼び出しを検証するため）
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("トップページ", () => {
  test("タイトルが表示されている", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("デジタル名刺アプリ")).toBeInTheDocument();
  });

  test("IDを入力してボタンを押すと /cards/:id に遷移する", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    await user.type(screen.getByRole("textbox"), "testuser");
    await user.click(screen.getByRole("button", { name: "名刺をみる" }));
    expect(mockNavigate).toHaveBeenCalledWith("/cards/testuser");
  });

  test("IDを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "名刺をみる" }));
    expect(screen.getByText("IDを入力してください")).toBeInTheDocument();
  });

  test("新規登録はこちらを押すと /cards/register に遷移する", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "新規登録はこちら" })).toHaveAttribute(
      "href",
      "/cards/register",
    );
  });
});

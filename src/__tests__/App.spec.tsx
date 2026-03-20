// テスト対象のコンポーネントをインポート
import App from "../App";
// render: コンポーネントを仮想DOMにレンダリングする
// screen: レンダリングされた画面の要素を取得する
import { screen } from "@testing-library/react";
// AppはuseNavigateを使うためRouterコンテキストが必要
import { MemoryRouter } from "react-router";
import { render } from "./test-utils";

// Navigatorモック準備
const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

// describe: テストをグループ化する
describe("App", () => {
  // test: 個別のテストケースを定義する
  test("タイトルがあること", () => {
    // Appコンポーネントをレンダリング
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    // "デジタル名刺アプリ" というテキストがDOM上に存在することを確認
    expect(screen.getByText("デジタル名刺アプリ")).toBeInTheDocument();
  });
});

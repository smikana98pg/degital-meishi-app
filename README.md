# デジタル名刺アプリ

IDを入力して名刺を検索・表示・登録できるWebアプリです。

## デモ

https://degital-meishi-app-a2a9c.web.app/

## 機能

- 名刺検索：IDを入力して名刺を表示
- 名刺表示：名前・自己紹介・スキル・SNSアイコンを表示
- 名刺登録：フォームから新規登録

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| UI | Chakra UI v3 |
| ルーティング | React Router v7 |
| フォーム | React Hook Form |
| データベース | Supabase |
| ホスティング | Firebase Hosting |
| テスト | Jest + Testing Library |
| CI/CD | GitHub Actions |

## ディレクトリ構成

```
src/
├── domain/       # 型定義（User, Skill）
├── repositories/ # DB操作（Supabase）
├── pages/        # ルートページ（データ取得担当）
├── components/   # UIコンポーネント（表示担当）
└── utils/        # Supabase クライアント設定
batch/
└── index.ts      # 前日データ削除バッチ
.github/workflows/
├── firebase-hosting-merge.yml       # mainマージ時にデプロイ
├── firebase-hosting-pull-request.yml # PR時にプレビューデプロイ
└── batch.yml                        # 毎朝6時に前日データ削除
```

## セットアップ

### 必要な環境変数

`.env` ファイルをプロジェクトルートに作成してください。

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### インストール・起動

```bash
npm install
npm run dev
```

### テスト実行

```bash
npm test
```

### バッチ手動実行

前日に登録されたユーザーデータを削除します。

```bash
npx tsx ./batch/index.ts
```

## GitHub Actions

### デプロイ

`main` ブランチへのマージ時に Firebase Hosting へ自動デプロイされます。

必要な GitHub Secrets：

| Secret名 | 説明 |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_DEGITAL_MEISHI_APP_A2A9C` | Firebase サービスアカウントキー |
| `VITE_SUPABASE_URL` | Supabase の URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase の匿名キー |

### バッチ（毎朝6時 JST）

前日に登録されたユーザーとスキル情報を自動削除します。

必要な GitHub Secrets：

| Secret名 | 説明 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase の URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase のサービスロールキー |

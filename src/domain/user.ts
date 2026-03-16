export class User {
  readonly user_id: string;
  readonly name: string;
  readonly description: number;
  readonly github_id: string;
  readonly qiita_id: string;
  readonly x_id: string;
  readonly created_at: string;

  constructor(
    user_id: string,
    name: string,
    description: number,
    github_id: string,
    qiita_id: string,
    x_id: string,
    created_at: string,
  ) {
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.github_id = github_id;
    this.qiita_id = qiita_id;
    this.x_id = x_id;
    this.created_at = created_at;
  }

  public static newUser(
    user_id: string,
    name: string,
    description: number,
    github_id: string,
    qiita_id: string,
    x_id: string,
    created_at: string,
  ): User {
    return new User(
      user_id,
      name,
      description,
      formatGithub(github_id),
      formatQiita(qiita_id),
      formatX(x_id),
      formatDate(created_at),
    );
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP");
}

function formatGithub(github_id: string): string {
  return `https://github.com/${github_id}`;
}
function formatQiita(qiita_id: string): string {
  return `https://qiita.com/${qiita_id}`;
}
function formatX(x_id: string): string {
  return `https://x.com/${x_id}`;
}

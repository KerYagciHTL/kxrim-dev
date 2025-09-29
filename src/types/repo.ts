export interface Repo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  topics?: string[];
  archived: boolean;
  pushed_at: string;
}
import asRecord from 'utils/asRecord';

export interface Label {
  id: number
  name: string
  color: string
}

export interface User {
  login: string
  avatar_url: string
}

export interface Issue {
  id: number
  title: string
  number: number
  user: User
  body: string
  labels: Label[]
  comments_url: string
  state: 'open' | 'closed';
  comments: number
}

export const getIssues = (
    org: string,
    repo: string,
    page = 1
  ) => {
      return {
        url: `https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`,
        transform: (response: any, headers: any) => {
          const issues = asRecord<number, Issue>(response, t => t.id);
          return {
            issues,
          };
        }
    }
  };
import { Issue } from "api/githubAPI";
import { asRecord } from "utils/normalizeUtils";

export const getIssuesQuery = (
    org: string,
    repo: string,
    page = 1
  ) => {
      return {
        url: `https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`,
        transform: (response: Issue[]) => {
          const issues = asRecord(response, t => t.id);
          return {
            issues,
          };
        }
    }
  };
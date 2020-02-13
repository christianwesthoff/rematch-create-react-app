import { Issue } from "api/githubAPI";
import parseLink, { Links } from 'parse-link-header'

// const getPageCount = (pageLinks: Links) => {
//     if (!pageLinks) {
//       return 0
//     }
//     if (isLastPage(pageLinks)) {
//       return parseInt(pageLinks.prev.page, 10) + 1
//     } else if (pageLinks.last) {
//       return parseInt(pageLinks.last.page, 10)
//     } else {
//       return 0
//     }
//   }

export const getIssuesQuery = (
    org: string,
    repo: string,
    page = 1
  ) => {
      return {
        url: `https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`,
        transform: (response: any) => {
            // The server responded with a JSON body: { "data": "hello" }
            // let pageCount = 0
            // const pageLinks = parseLink(issuesResponse.headers.link)
        
            // if (pageLinks !== null) {
            //   pageCount = getPageCount(pageLinks)
            // }
        

            return {
                issues1: response,
            };
          },
        update: {
            issues1: (oldValue: Issue[], newValue: Issue[]) => {
              return [...oldValue || [], ...newValue];
            },
        }
    }
};
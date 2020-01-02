import { RootDispatch } from 'app/store'
import { Issue, IssuesResult, getIssue, getIssues } from 'api/githubAPI'
import { Links } from 'parse-link-header'

type IssuesState = {
	issuesByNumber: Record<number, Issue>
	currentPageIssues: number[]
	pageCount: number
	pageLinks: Links | null
}

const issuesInitialState: IssuesState = {
	issuesByNumber: {},
	currentPageIssues: [],
	pageCount: 0,
	pageLinks: {},
}

export type GetIssuePayload = {
	org:string,
	repo:string,
	number:number
}

export type GetIssuesPayload = {
	org:string,
	repo:string,
	page:number
}

export const issues = {
	state: issuesInitialState,
	reducers: {
		getIssueSuccess(state: IssuesState, payload: Issue) {
			const { number } = payload;
			state.issuesByNumber[number] = payload;
			return state;
		},
		getIssuesSuccess(state: IssuesState, payload: IssuesResult) {
			const { pageCount, issues, pageLinks } = payload;
			state.pageCount = pageCount;
			state.pageLinks = pageLinks;
			issues.forEach(issue => {
				state.issuesByNumber[issue.number] = issue;
			});
		
			state.currentPageIssues = issues.map(issue => issue.number);
			return state;
		},
	},
	effects: (dispatch: RootDispatch) => ({
		async getIssue(payload:GetIssuePayload) {
			const issue = await getIssue(payload.org, payload.repo, payload.number);
			dispatch.issues.getIssueSuccess(issue);
		},
		async getIssues(payload:GetIssuesPayload) {
			const issues = await getIssues(payload.org, payload.repo, payload.page);
			dispatch.issues.getIssuesSuccess(issues);
		},
	}),
}
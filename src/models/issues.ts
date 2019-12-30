import { RootDispatch } from 'app/store'
import { Issue, IssuesResult, getIssue, getIssues } from 'api/githubAPI'
import { Links } from 'parse-link-header'

type IssuesState = {
	issuesByNumber: Record<number, Issue>
	currentPageIssues: number[]
	pageCount: number
	pageLinks: Links | null
	isLoading: boolean
	error: string | null
}

const issuesInitialState: IssuesState = {
	issuesByNumber: {},
	currentPageIssues: [],
	pageCount: 0,
	pageLinks: {},
	isLoading: false,
	error: null
}

function startLoading(state: IssuesState):IssuesState {
	state.isLoading = true;
	return state;
}

function loadingFailed(state: IssuesState, error: string):IssuesState {
	state.isLoading = false;
	state.error = error;
	return state;
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
		getIssueStart: startLoading,
		getIssuesStart: startLoading,
		getIssueFailure: loadingFailed,
		getIssuesFailure: loadingFailed,
		getIssueSuccess(state: IssuesState, payload: Issue) {
			const { number } = payload;
			state.issuesByNumber[number] = payload;
			state.isLoading = false;
			state.error = null;
			return state;
		},
		getIssuesSuccess(state: IssuesState, payload: IssuesResult) {
			const { pageCount, issues, pageLinks } = payload;
			state.pageCount = pageCount;
			state.pageLinks = pageLinks;
			state.isLoading = false;
			state.error = null;
		
			issues.forEach(issue => {
				state.issuesByNumber[issue.number] = issue;
			});
		
			state.currentPageIssues = issues.map(issue => issue.number);
			return state;
		},
	},
	effects: (dispatch: RootDispatch) => ({
		async getIssue(payload:GetIssuePayload) {
			try {
				dispatch.issues.getIssueStart();
				const issue = await getIssue(payload.org, payload.repo, payload.number);
				dispatch.issues.getIssueSuccess(issue);
			} catch (err) {
				dispatch.issues.getIssueFailure(err);
			} 

		},
		async getIssues(payload:GetIssuesPayload) {
			try {
				dispatch.issues.getIssuesStart();
				const issues = await getIssues(payload.org, payload.repo, payload.page);
				dispatch.issues.getIssuesSuccess(issues);
			} catch (err) {
				dispatch.issues.getIssuesFailure(err);
			} 
		},
	}),
}
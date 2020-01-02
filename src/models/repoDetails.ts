import { RootDispatch } from 'app/store'
import { RepoDetails, getRepoDetails } from 'api/githubAPI'

export type RepoDetailsState = {
    openIssuesCount: number
}

const repoDetailsInitialState: RepoDetailsState = {
    openIssuesCount: -1
}

export type GetRepoDetailsPayload = {
	org:string,
	repo:string,
}

export const repoDetails = {
	state: repoDetailsInitialState,
	reducers: {
        getRepoDetailsSuccess(state: RepoDetailsState, payload: RepoDetails) {
			const { open_issues_count } = payload;
            state.openIssuesCount = open_issues_count;
			return state;
        },
	},
	effects: (dispatch: RootDispatch) => ({
		async getRepoDetails(payload:GetRepoDetailsPayload) {
			const repoDetails = await getRepoDetails(payload.org, payload.repo);
			dispatch.repoDetails.getRepoDetailsSuccess(repoDetails);
		}
	}),
}
import { RootDispatch } from 'app/store'
import { RepoDetails, getRepoDetails } from 'api/githubAPI'
import { Links } from 'parse-link-header'

export type RepoDetailsState = {
    openIssuesCount: number
    error: string | null
}

const repoDetailsInitialState: RepoDetailsState = {
    openIssuesCount: -1,
    error: null
}

export type GetRepoDetailsPayload = {
	org:string,
	repo:string,
}

export const repoDetails = {
	state: repoDetailsInitialState,
	reducers: {
        getRepoDetailsSuccess(state: RepoDetailsState, repoDetails: RepoDetails) {
            state.openIssuesCount = repoDetails.open_issues_count;
			state.error = null;
			return state;
        },
        getRepoDetailsFailed(state: RepoDetailsState, error: string) {
            state.openIssuesCount = -1;
			state.error = error;
			return state;
        }
	},
	effects: (dispatch: RootDispatch) => ({
		async getRepoDetails(payload:GetRepoDetailsPayload) {
			try {
				const repoDetails = await getRepoDetails(payload.org, payload.repo);
				dispatch.repoDetails.getRepoDetailsSuccess(repoDetails);
			} catch (err) {
				dispatch.repoDetails.getRepoDetailsFailed(err);
			} 

		}
	}),
}
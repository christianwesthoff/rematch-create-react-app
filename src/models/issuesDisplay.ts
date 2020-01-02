export interface CurrentDisplay {
    displayType: 'issues' | 'comments'
    issueId: number | null
}

export interface CurrentDisplayPayload {
    displayType: 'issues' | 'comments'
    issueId?: number
}

export interface CurrentRepo {
    org: string
    repo: string
}

type CurrentDisplayState = {
    page: number
} & CurrentDisplay &
CurrentRepo

let issuesDisplayInitialState: CurrentDisplayState = {
    org: 'dotnet',
    repo: 'core',
    page: 1,
    displayType: 'issues',
    issueId: null
}

export const issuesDisplay = {  
    state: issuesDisplayInitialState,
    reducers: {
        displayRepo(state: CurrentDisplayState, payload: CurrentRepo) {
            const { org, repo } = payload;
            state.org = org;
            state.repo = repo;
            return state;
        },
        setCurrentPage(state: CurrentDisplayState, page: number) {
            state.page = page;
            return state;
        },
        setCurrentDisplayType(state: CurrentDisplayState, payload: CurrentDisplayPayload) {
            const { displayType, issueId = null } = payload
            state.displayType = displayType;
            state.issueId = issueId;
            return state;
        }
    }
}
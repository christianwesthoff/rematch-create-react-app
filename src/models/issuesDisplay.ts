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
            return { ...state, org, repo };
        },
        setCurrentPage(state: CurrentDisplayState, page: number) {
            return { ...state, page };
        }
    }
}
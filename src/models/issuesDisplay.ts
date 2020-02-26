
export interface CurrentRepo {
    org: string
    repo: string
}

type CurrentDisplayState = {
    page: number
} & 
CurrentRepo

const issuesDisplayInitialState: CurrentDisplayState = {
    org: 'dotnet',
    repo: 'core',
    page: 1
}

export const issuesDisplay = {  
    state: issuesDisplayInitialState,
    reducers: {
        displayRepo(state: CurrentDisplayState, payload: CurrentRepo): CurrentDisplayState {
            const { org, repo } = payload;
            return { ...state, org, repo };
        },
        setCurrentPage(state: CurrentDisplayState, page: number): CurrentDisplayState {
            return { ...state, page };
        }
    }
}
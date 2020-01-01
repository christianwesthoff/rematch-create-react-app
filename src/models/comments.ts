import { RootDispatch } from "app/store"
import { Comment, getComments, Issue } from 'api/githubAPI'

interface CommentsState {
    commentsByIssue: Record<number, Comment[] | undefined>
    loading: boolean
    error: string | null
}
  
interface CommentLoaded {
    issueId: number
    comments: Comment[]
}

const commentsInitialState: CommentsState = {
    commentsByIssue: {},
    loading: false,
    error: null
}

export const comments = {
	state: commentsInitialState,
	reducers: {
        getCommentsStart(state: CommentsState) {
            state.loading = true;
            state.error = null;
            return state;
        },
        getCommentsSuccess(state: CommentsState, payload: CommentLoaded) {
            const { comments, issueId } = payload;
            state.commentsByIssue[issueId] = comments;
            state.loading = false;
            state.error = null;
            return state;
        },
        getCommentsFailure(state: CommentsState, error: string) {
            state.loading = false;
            state.error = error;
            return state;
        }
	},
	effects: (dispatch: RootDispatch) => ({
		async getComments(issue: Issue) {
			try {
                dispatch.comments.getCommentsStart();
                const comments = await getComments(issue.comments_url);
				dispatch.comments.getCommentsSuccess({ issueId: issue.number, comments });
			} catch (err) {
				dispatch.comments.getCommentsFailure(err);
			} 
		}
	})
}
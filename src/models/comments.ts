import { RootDispatch } from "app/store"
import { Comment, getComments, Issue } from 'api/githubAPI'

interface CommentsState {
    commentsByIssue: Record<number, Comment[] | undefined>
}
  
interface CommentLoaded {
    issueId: number
    comments: Comment[]
}

const commentsInitialState: CommentsState = {
    commentsByIssue: {},
}

export const comments = {
	state: commentsInitialState,
	reducers: {
        getCommentsSuccess(state: CommentsState, payload: CommentLoaded) {
            const { comments, issueId } = payload;
            state.commentsByIssue[issueId] = comments;
            return state;
        }
	},
	effects: (dispatch: RootDispatch) => ({
		async getComments(issue: Issue) {
            const comments = await getComments(issue.comments_url);
            dispatch.comments.getCommentsSuccess({ issueId: issue.number, comments });
		}
    }),
}
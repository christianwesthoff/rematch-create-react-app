import React, { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'

import { insertMentionLinks } from 'utils/stringUtils'
import { IssueLabels } from 'components/IssueLabels'

import { IssueMeta } from './IssueMeta'
import { IssueComments } from './IssueComments'

import styles from './IssueDetailsPage.module.css'
import './IssueDetailsPage.css'
import { RootState, RootDispatch } from 'app/store'
import { Issue } from 'api/githubAPI'
import { GetIssuePayload } from 'models/issues'

interface IDProps {
  org: string
  repo: string
  issueId: number
  showIssuesList: () => void
}

const mapDispatch = (dispatch: RootDispatch) => ({
  getIssue: (payload:GetIssuePayload) => dispatch.issues.getIssue(payload),
  getComments: (payload:Issue) => dispatch.comments.getComments(payload)
})

export const IssueDetailsPage = ({
  org,
  repo,
  issueId,
  showIssuesList
}: IDProps) => {
  const dispatch: RootDispatch = useDispatch()

  const issue = useSelector(
    (state: RootState) => state.issues.issuesByNumber[issueId]
  )

  const { commentsLoading, commentsError, comments } = useSelector(
    (state: RootState) => {
      return {
        commentsLoading: state.api.effects.comments.getComments.isLoading,
        commentsError: state.api.effects.comments.getComments.error,
        comments: state.comments.commentsByIssue[issueId]
      }
    },
    shallowEqual
  )

  useEffect(() => {

    const { getIssue } = mapDispatch(dispatch);

    if (!issue) {
      getIssue({ org, repo, number: issueId });
    }

    // Since we may have the issue already, ensure we're scrolled to the top
    window.scrollTo({ top: 0 })
  }, [org, repo, issueId, issue, dispatch])

  useEffect(() => {

    const { getComments } = mapDispatch(dispatch);

    if (issue) {
      getComments(issue);
    }
  }, [issue, dispatch])

  let content

  const backToIssueListButton = (
    <button className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  )

  if (issue === null) {
    content = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>Loading issue #{issueId}...</p>
      </div>
    )
  } else {
    let renderedComments

    if (comments) {
      renderedComments = <IssueComments issue={issue} comments={comments} />
    } else if (commentsLoading) {
      renderedComments = (
        <div className="issue-detail--loading">
          <p>Loading comments...</p>
        </div>
      )
    } else if (commentsError) {
      renderedComments = (
        <div className="issue-detail--error">
          <h1>Could not load comments for issue #{issueId}</h1>
          <p>{commentsError.toString()}</p>
        </div>
      )
    }

    content = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown
            className={'testing'}
            source={insertMentionLinks(issue.body)}
          />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    )
  }

  return <div>{content}</div>
}

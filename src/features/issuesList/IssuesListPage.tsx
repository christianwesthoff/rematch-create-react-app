import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, RootDispatch } from 'app/store'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'
import { GetIssuesPayload } from 'models/issues'
import { GetRepoDetailsPayload } from 'models/repoDetails'

import useQuery from 'extensions/rematchRequests/react/use-query'
import { getIssuesQuery } from 'queries/issues'

const mapDispatch = (dispatch: RootDispatch) => ({
  getIssues: (payload:GetIssuesPayload) => dispatch.issues.getIssues(payload),
  getRepoDetails:(payload:GetRepoDetailsPayload) => dispatch.repoDetails.getRepoDetails(payload),
  requestAsync:(payload:any) => (dispatch as any).queries.requestAsync(payload)
})

interface ILProps {
  org: string
  repo: string
  page: number
  setJumpToPage: (page: number) => void
  showIssueComments: (issueId: number) => void
}

export const IssuesListPage = ({
  org,
  repo,
  page = 1,
  setJumpToPage,
  showIssueComments
}: ILProps) => {

  const { issuesLoading, issuesError, issues } = useSelector(
    (state: RootState) => {
      return {
        issuesLoading: false,
        issuesError: null,
        issues: state.issues,
      }
    }
  )

  const [query, entities] = useQuery(getIssuesQuery(org, repo, page));
  const openIssueCount = useSelector((state: RootState) => state.repoDetails.openIssuesCount);
  const dispatch: RootDispatch = useDispatch();

  const {
    currentPageIssues,
    issuesByNumber,
    pageCount
  } = issues;

  const currentPageIssuesByNumber = currentPageIssues.map(
    issueNumber => issuesByNumber[issueNumber]
  )

  // useEffect(() => {

  //   const {
  //     requestAsync,
  //   } = mapDispatch(dispatch);

  //   requestAsync(getIssuesQuery(org, repo, page));

  // }, [org, repo, page, dispatch])

  useEffect(() => {

    const {
      getRepoDetails
    } = mapDispatch(dispatch);

    // getIssues({ org, repo, page });
    getRepoDetails({ org, repo });
  }, [org, repo, page, dispatch])

  if (issuesError) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{issuesError}</div>
      </div>
    )
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1

  let renderedList = issuesLoading ? (
    <h3>Loading...</h3>
  ) : (
    <IssuesList issues={currentPageIssuesByNumber} showIssueComments={showIssueComments} />
  )

  const onPageChanged: OnPageChangeCallback = selectedItem => {
    const newPage = selectedItem.selected + 1
    setJumpToPage(newPage)
  }

  return (
    <div id="issue-list-page">
      <strong>Query Information</strong>
      <div>{JSON.stringify(query)}</div>
      <br/>
      <strong>Query Data</strong>
      <div>
      {query.isFinished && !query.isError && entities.issues ? entities.issues.map(issue => (<div>
      <div><strong>{issue.id} </strong><span>{issue.body}</span></div>
      </div>)) : query.isPending ? <strong>Loading...</strong> : query.isError ? <strong>{JSON.stringify(query.error)}</strong> : <></>}</div>
      <IssuesPageHeader
        openIssuesCount={openIssueCount}
        org={org}
        repo={repo}
      />
      {/* {renderedList} */}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  )
}
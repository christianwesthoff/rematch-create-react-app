import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, RootDispatch } from 'app/store'

import { fetchIssuesCount } from 'features/repoSearch/repoDetailsSlice'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'
import { GetIssuePayload, GetIssuesPayload } from 'models/issues'
import { GetRepoDetailsPayload } from 'models/repoDetails'
import { getRepoDetails } from 'api/githubAPI'

const mapState = (state: RootState) => ({
  issues: state.issues,
  openIssueCount: state.repoDetails.openIssuesCount
})

const mapDispatch = (dispatch: RootDispatch) => ({
  getIssue: (payload:GetIssuePayload) => dispatch.issues.getIssue(payload),
  getIssues: (payload:GetIssuesPayload) => dispatch.issues.getIssues(payload),
  getRepoDetails:(payload:GetRepoDetailsPayload) => dispatch.repoDetails.getRepoDetails(payload)
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
  const { issues, openIssueCount } = useSelector(mapState);
  const dispatch: RootDispatch = useDispatch();
	const {
    getIssues,
    getRepoDetails
  } = mapDispatch(dispatch);
  
  const {
    currentPageIssues,
    isLoading,
    error: issuesError,
    issuesByNumber,
    pageCount
  } = issues;


  const currentPageIssuesByNumber = currentPageIssues.map(
    issueNumber => issuesByNumber[issueNumber]
  )

  useEffect(() => {
    getIssues({ org, repo, page });
    getRepoDetails({ org, repo });
  }, [org, repo, page, dispatch])

  if (issuesError) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{issuesError.toString()}</div>
      </div>
    )
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1

  let renderedList = isLoading ? (
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
      <IssuesPageHeader
        openIssuesCount={openIssueCount}
        org={org}
        repo={repo}
      />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  )
}

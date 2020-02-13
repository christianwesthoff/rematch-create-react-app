import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, RootDispatch } from 'app/store'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'
import { GetIssuesPayload } from 'models/issues'
import { GetRepoDetailsPayload } from 'models/repoDetails'
import { getIssuesQuery } from 'queries/issues'

import { useRequest } from 'redux-query-react';

const mapDispatch = (dispatch: RootDispatch) => ({
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

  const { issuesLoading, issuesError, issues } = useSelector(
    (state: RootState) => {
      return {
        issuesLoading: state.api.effects.issues.getIssues.isLoading,
        issuesError: state.api.effects.issues.getIssues.error,
        issues: state.issues,
      }
    }
  )

  const issues1 = useSelector((state:any) => state.entities.issues1) || [];

  const [{ isPending, status }, refresh] = useRequest<any>(getIssuesQuery(org, repo, page));

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

  useEffect(() => {

    const {
      getIssues,
      getRepoDetails
    } = mapDispatch(dispatch);

    // getIssues({ org, repo, page });
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
      <div>{JSON.stringify(isPending)}</div>
      <div>{JSON.stringify(status)}</div>
      <div>{JSON.stringify(issues1)}</div>
      {/* <IssuesPageHeader
        openIssuesCount={openIssueCount}
        org={org}
        repo={repo}
      />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      /> */}
    </div>
  )
}

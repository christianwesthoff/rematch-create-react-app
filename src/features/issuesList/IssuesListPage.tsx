import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, RootDispatch } from 'app/store'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'
import { GetIssuesPayload } from 'models/issues'
import { GetRepoDetailsPayload } from 'models/repoDetails'

import { Issue } from 'api/githubAPI'
import useRequest from 'extensions/rematchQuery/react/use-request'

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

const asRecord = <K extends string|number|symbol, T extends any>(list: Array<T>, selector: (elem:T) => K):Record<K, T> => 
  list.reduce((acc, curr) => {
    const key = selector(curr);
    acc[key] = curr;
    return acc;
  }, {} as any);

const getIssuesQuery = (
  org: string,
  repo: string,
  page = 1
) => {
    return {
      url: `https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`,
      transform: (response: Issue[]) => {
          // The server responded with a JSON body: { "data": "hello" }
          // let pageCount = 0
          // const pageLinks = parseLink(issuesResponse.headers.link)
      
          // if (pageLinks !== null) {
          //   pageCount = getPageCount(pageLinks)
          // }
          const issues = asRecord(response, t => t.id);
          return {
            issues,
          };
        },
      update: {
          issues: (oldValue: Record<number, Issue>, newValue: Record<number, Issue>) => {
            return {...oldValue || {}, ...newValue };
          },
      },
      map: {
          issues: (value: Record<number, Issue>) => {
            return Object.keys(value);
          }
      }
  }
};

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

  const [query, entities] = useRequest(getIssuesQuery(org, repo, page));
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
      <div>{JSON.stringify(entities)}</div>
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
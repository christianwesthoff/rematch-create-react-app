import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/issuesList/IssuesListPage'
import { IssueDetailsPage } from 'features/issueDetails/IssueDetailsPage'
import { CurrentRepo, CurrentDisplayPayload } from 'models/issuesDisplay'
import { RootDispatch, RootState } from './store'

import './App.css'

const mapDispatch = (dispatch: RootDispatch) => ({
  displayRepo: (payload:CurrentRepo) => dispatch.issuesDisplay.displayRepo(payload),
  setCurrentDisplayType: (payload:CurrentDisplayPayload) => dispatch.issuesDisplay.setCurrentDisplayType(payload),
  setCurrentPage: (page:number) => dispatch.issuesDisplay.setCurrentPage(page),
  invalidateQueryPattern:(payload:any) => (dispatch as any).queries.invalidateQueryPattern(payload)
})

const App: React.FC = () => {
  const dispatch: RootDispatch = useDispatch()
  const { displayRepo, setCurrentDisplayType, setCurrentPage , invalidateQueryPattern } = mapDispatch(dispatch);
  
  const { org, repo, displayType, page, issueId } = useSelector(
    (state: RootState) => state.issuesDisplay
  )

  const setOrgAndRepo = (org: string, repo: string) => {
    displayRepo({ org, repo });
  }

  const setJumpToPage = (page: number) => {
    setCurrentPage(page);
  }

  const showIssuesList = () => {
    setCurrentDisplayType({ displayType: 'issues' });
  }

  const showIssueComments = (issueId: number) => {
    setCurrentDisplayType({ displayType: 'comments', issueId });
  }

  const setInvalidateQuery = (page: number) => {
    invalidateQueryPattern(`*https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}*`)
  }

  const setInvalidateRepo = () => {
    invalidateQueryPattern(`*https://api.github.com/repos/${org}/${repo}/issues*`)
  }


  let content

  if (displayType === 'issues') {
    content = (
      <React.Fragment>
        <RepoSearchForm
          org={org}
          repo={repo}
          setOrgAndRepo={setOrgAndRepo}
          setJumpToPage={setJumpToPage}
          setInvalidateQuery={setInvalidateQuery}
          setInvalidateRepo={setInvalidateRepo}
        />
        <IssuesListPage
          org={org}
          repo={repo}
          page={page}
          setJumpToPage={setJumpToPage}
          showIssueComments={showIssueComments}
        />
      </React.Fragment>
    )
  } else if (issueId !== null) {
    const key = `${org}/${repo}/${issueId}`
    content = (
      <IssueDetailsPage
        key={key}
        org={org}
        repo={repo}
        issueId={issueId}
        showIssuesList={showIssuesList}
      />
    )
  }

  return <div className="App">{content}</div>
}

export default App

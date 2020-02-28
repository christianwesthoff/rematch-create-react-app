import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { RepoSearchForm } from 'features/Issues/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/Issues/issuesList/IssuesListPage'
import { CurrentRepo } from 'models/issuesDisplay'
import { RootDispatch, RootState } from 'store'

const mapDispatch = (dispatch: RootDispatch) => ({
  displayRepo: (payload:CurrentRepo) => dispatch.issuesDisplay.displayRepo(payload),
  setCurrentPage: (page:number) => dispatch.issuesDisplay.setCurrentPage(page),
  invalidateQuery:(payload:Array<any>) => dispatch.queries.invalidateQuery(payload)
})

const Issues: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  
  const { displayRepo, setCurrentPage, invalidateQuery } = mapDispatch(dispatch);
  
  const { org, repo, page } = useSelector(
    (state: RootState) => state.issuesDisplay
  )

  const setOrgAndRepo = (org: string, repo: string) => {
    displayRepo({ org, repo });
  }

  const setJumpToPage = (page: number) => {
    setCurrentPage(page);
  }

  const setInvalidateQuery = (page: number) => invalidateQuery([`https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`])

  const setInvalidateRepo = () => invalidateQuery([`api.github.com`])


  let content = (
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
        />
      </React.Fragment>
    )

  return <div>{content}</div>
}

export default Issues

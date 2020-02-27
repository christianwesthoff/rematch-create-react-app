import React from 'react'
import get from 'utils/get'

import useQuery from 'rematch/rematch-request/react/use-query'
import { getIssuesQuery } from 'queries/issues'

interface ILProps {
  org: string
  repo: string
  page: number
}

export const IssuesListPage = ({
  org,
  repo,
  page = 1,
}: ILProps) => {

  const [query, entities] = useQuery(getIssuesQuery(org, repo, page));

  return (
    <div id="issue-list-page">
      <strong>Query Information</strong>
      <div>{JSON.stringify(query)}</div>
      <br/>
      <strong>Query Data</strong>
      <div>
      {query.isFinished && !query.isError ? get(entities, _ => _.issues,  []).map((issue, key) => (
        <div key={key}>
        <div><strong>{issue.id} </strong><span>{issue.body}</span></div>
      </div>)) : query.isPending ? <strong>Loading...</strong> : query.isError ? <strong>{JSON.stringify(query.error)}</strong> : <></>}</div>
    </div>
  )
}
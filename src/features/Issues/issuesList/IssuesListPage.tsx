import React from 'react';
import get from 'utils/get';

import { getIssues } from 'queries/issues';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useQueries from 'rematch/rematch-request/hooks/use-queries';

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

  const [query,,querySelector] = useQueries([getIssues(org, repo, page)]);
  const entities = useSelector((state: RootState) => querySelector(state));

  return (
    <div id="issue-list-page">
      <strong>Query Information</strong>
      <div>{JSON.stringify(query)}</div>
      <br/>
      <strong>Query Data</strong>
      <div>
      {query.isFinished && !query.isError ? get(entities!, _ => _.issues, []).map((issue, key) => (
        <div key={key}>
        <div><strong>{issue.id} </strong><span>{issue.body}</span></div>
      </div>)) : query.isPending ? <strong>Loading...</strong> : query.isError ? <strong>{JSON.stringify(query.errors)}</strong> : <></>}</div>
    </div>
  )
}
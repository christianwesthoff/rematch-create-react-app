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

  const [queries,,queriesSelector] = useQueries([getIssues(org, repo, page)]);
  const entities = useSelector((state: RootState) => queriesSelector(state));

  return (
    <div id="issue-list-page">
      <strong>Query Information</strong>
      <div>{JSON.stringify(queries)}</div>
      <br/>
      <strong>Query Data</strong>
      <div>
      {queries.isFinished && !queries.isError ? get(entities, _ => _.issues, []).map((issue, key) => (
        <div key={key}>
        <div><strong>{issue.id} </strong><span>{issue.body}</span></div>
      </div>)) : queries.isPending ? <strong>Loading...</strong> : queries.isError ? <strong>{JSON.stringify(queries.errors)}</strong> : <></>}</div>
    </div>
  )
}
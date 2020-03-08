import React from 'react';
import idx from 'utils/idx';

import useQuery from 'rematch/rematch-request/hooks/use-query';
import { getIssues } from 'queries/issues';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

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

  const [query,,querySelect] = useQuery(getIssues(org, repo, page));
  const entities = useSelector((state: RootState) => querySelect(state));

  return (
    <div id="issue-list-page">
      <strong>Query Information</strong>
      <div>{JSON.stringify(query)}</div>
      <br/>
      <strong>Query Data</strong>
      <div>
      {query.isFinished && !query.isError ? idx(entities!, _ => _.issues, []).map((issue, key) => (
        <div key={key}>
        <div><strong>{issue.id} </strong><span>{issue.body}</span></div>
      </div>)) : query.isPending ? <strong>Loading...</strong> : query.isError ? <strong>{JSON.stringify(query.error)}</strong> : <></>}</div>
    </div>
  )
}
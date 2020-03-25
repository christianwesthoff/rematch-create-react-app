import React from 'react';
import { getUsers } from 'queries/test';
import useQuery from 'rematch/rematch-request/hooks/use-query';

const Home = () => {
  const [query,,querySelect] = useQuery(getUsers());
  return (
  <div>
    Startseite
  </div>
)};

export default Home

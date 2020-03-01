import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, RootDispatch } from 'store';
import { ChangeHandler } from 'types/dom';
import { Claims } from 'models/userInfo';

const displayName = (claims?: Claims | undefined) => claims ? `${claims['firstname']} ${claims['lastname']}` : '';

const Navigation = () => {
  const { isAuthorized } = useSelector((state: RootState) => state.auth)
  const { claims } = useSelector((state: RootState) => state.userInfo)
  const dispatch: RootDispatch = useDispatch();
  const handleClick:  ChangeHandler = e => {
    e.preventDefault();
    dispatch.auth.logout();
  }

  return (<div>
            <div><Link to="/">Home</Link> <Link to="/query">Query</Link> {isAuthorized ? (<><a href="/#" onClick={handleClick}>Logout</a> {displayName(claims)}</>) : <Link to="/login">Login</Link>}</div> 
        </div>)
}

export default Navigation

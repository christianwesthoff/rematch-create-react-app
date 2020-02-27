import React, { useState, ChangeEvent } from 'react'
import { RootDispatch, RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { UserCredentials } from 'models/auth'

type InputEvent = ChangeEvent<HTMLInputElement>
type ChangeHandler = (e: InputEvent) => void

const mapDispatch = (dispatch: RootDispatch) => ({
    login: (credentials: UserCredentials) => dispatch.auth.login(credentials),
});

const Login = () => {

  const dispatch: RootDispatch = useDispatch();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);

  const { login } = mapDispatch(dispatch);

  const [{ userName, password }, setLogin] = useState({ userName: "", password: "" });

  const onPasswordChange: ChangeHandler = e => {
    e.persist();
    setLogin(state => ({ ...state, password: e.target?.value }));
  }

  const onUserNameChange: ChangeHandler = e => {
    e.persist();
    setLogin(state => ({ ...state, userName: e.target?.value }));
  }

  const onLoginClick = () => {
    if (!userName || !password) return;
    login({ userName, password });
  }

  return (
    <form className="pure-form">
      <div>
        <label htmlFor="username">
          Username:
        </label>
        <input name="username" type="text" value={userName} onChange={onUserNameChange} />
        <br/>
        <label htmlFor="password">
          Password:
        </label>
        <input name="password" type="password" value={password} onChange={onPasswordChange} />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoginClick}
        >
          Login
        </button><br />
        {isLoading ? "Loading..." : ""}
        {error ? error: ""}
      </div>
    </form>
  )
}

export default Login;
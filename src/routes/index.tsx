import React from 'react'
import { Route, Switch } from 'react-router'
import Home from 'features/Home'
import Navigation from 'components/router/Navigation'
import NoMatch from 'features/Error'
import Query from 'features/Issues'
import Login from 'features/Login'
import PrivateRoute from 'components/router/PrivateRoute'
import ConditionalRoute from 'components/router/ConditionalRoute'
import { RootState } from 'store'

const routes = (
  <div>
    <Navigation />
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute path="/query" component={Query} />
      <ConditionalRoute path="/login" component={Login} when={(state: RootState) => !state.auth.isAuthorized} else="/" />
      <Route component={NoMatch} />
    </Switch>
  </div>
)

export default routes

import React from 'react'
import { Route, Switch } from 'react-router'
import Home from 'features/Home'
import NavBar from 'routes/Nav'
import NoMatch from 'features/Error'
import Query from 'features/Issues'
import Login from 'features/Login'
import PrivateRoute from 'components/router/PrivateRoute'

const routes = (
  <div>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute path="/query" component={Query} />
      <Route path="/login" component={Login} />
      <Route component={NoMatch} />
    </Switch>
  </div>
)

export default routes

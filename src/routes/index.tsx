import React from 'react'
import { Route, Switch } from 'react-router'
import Home from 'features/Home'
import NavBar from 'routes/NavBar'
import NoMatch from 'features/Error'
import Query from 'features/Issues'

const routes = (
  <div>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/query" component={Query} />
      <Route component={NoMatch} />
    </Switch>
  </div>
)

export default routes

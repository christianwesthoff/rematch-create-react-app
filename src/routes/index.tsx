import React from 'react'
import { Route, Switch } from 'react-router'
import Home from 'components/Home'
import NavBar from 'components/NavBar'
import NoMatch from 'components/NoMatch'
import Query from 'components/Query'

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

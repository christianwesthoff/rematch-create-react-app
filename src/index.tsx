import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './app/store'
import { history } from 'extensions/rematch-router'

import './index.css'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'

const render = () => {
  const App = require('./app/App').default

  ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
          <>
            <Switch>
              <Route exact path="/" component={() => <App />} />
              <Route render={() => (<div>Not found</div>)} />
            </Switch>
        </>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render)
}

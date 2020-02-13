import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Provider as ReduxQueryProvider } from 'redux-query-react';
import store, { getQueries } from './app/store'

import './index.css'

const render = () => {
  const App = require('./app/App').default

  ReactDOM.render(
    <Provider store={store}>
      <ReduxQueryProvider queriesSelector={getQueries}>
        <App />
      </ReduxQueryProvider>
    </Provider>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render)
}

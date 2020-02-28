import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { history } from 'rematch/rematch-react-router'
import App from './containers/App'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = getPersistor();

const render = () => {
  ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App history={history} />
        </PersistGate>
      </Provider>,
    document.getElementById('root')
  )
};

render();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./containers/App', render);
}

if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_MOCK === 'true') {
  const configureApi = require('./tests/axios').default;
  configureApi();
}

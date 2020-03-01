import React from 'react';
import { History } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import routes from 'routes';
import NotificationsSystem from 'reapop';
import theme from '../../configs/default-reapop-theme';

interface AppProps {
  history: History;
}

const App = ({ history }: AppProps) => {
  return (
    <>
    <NotificationsSystem theme={theme} />
    <ConnectedRouter history={history}>
      { routes }
    </ConnectedRouter>
    </>
  )
}

export default App
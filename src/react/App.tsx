import React, { FC } from "react";
import { MantineProvider } from "@mantine/core";
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RouteHandler from "./components/routerHandler/RouterHandler";
import Home from "./page/Home";
import Config from "./page/Config";
import Update from "./page/Update";
import Layout from "./components/Layout";
import { Provider } from "react-redux"
import store from './store';
import Splash from "./page/Splash";
import { Notifications } from "@mantine/notifications";
import Restore from "./page/Restore";
import { useDisclosure } from "@mantine/hooks";
 


const router = createHashRouter([
  {
    path: '/',
    element: <RouteHandler />,
    children: [
      { 
        path: '/app',
        element: <Layout/>,
        children: [
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'config',
            element: <Config />,
          },
          {
            path: 'restore',
            element: <Restore />,
          },
        ]
      },
      {
        path: '',
        element: <Splash />,
      },
      {
        path: '/update',
        element: <Update />,
      },
    ]
  },
]);

const App: FC = () => {
  const [opened, {open, close}] = useDisclosure(false);

    return (
      <Provider store={store}>
        <MantineProvider withCSSVariables withGlobalStyles theme={{ colorScheme: 'dark' }}>
          <Notifications/>
          <RouterProvider router={router}/>
        </MantineProvider>
      </Provider>
    );
};

export default App;

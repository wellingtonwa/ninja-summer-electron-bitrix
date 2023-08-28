import React, { FC } from "react";
import { Provider } from "react-redux"
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Config from "./page/Config";
import Home from "./page/Home";
import Layout from "./components/Layout";
import RouteHandler from "./components/routerHandler/RouterHandler";
import Restore from "./page/Restore";
import Splash from "./page/Splash";
import Update from "./page/Update";
import store from './store';
 


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
          <ModalsProvider>
            <Notifications/>
            <RouterProvider router={router}/>
          </ModalsProvider>
        </MantineProvider>
      </Provider>
    );
};

export default App;

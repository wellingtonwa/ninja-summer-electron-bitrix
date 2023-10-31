import React, { FC } from "react";
import { Provider } from "react-redux"
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Config from "./page/Config";
import Dashboard from "./page/dashboard/Dashboard";
import Layout from "./components/Layout";
import RouteHandler from "./components/routerHandler/RouterHandler";
import ByFolder from "./page/byfolder/ByFolder";
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
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'config',
            element: <Config />,
          },
          {
            path: 'restore',
            element: <Restore />,
          },
          {
            path: 'byfolder',
            element: <ByFolder />,
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

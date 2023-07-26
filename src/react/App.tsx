import React, { FC } from "react";
import { MantineProvider } from "@mantine/core";
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RouteHandler from "./components/routerHandler/RouterHandler";
import Home from "./page/Home";
import Config from "./page/Config";
import { Provider } from "react-redux"
import store from './store';
import Splash from "./page/Splash";
import { Notifications } from "@mantine/notifications";
import Restore from "./page/Restore";
import { useDisclosure } from "@mantine/hooks";
import Menu from "./page/Menu";
import Log from "./page/Log";
import Header from "./page/Header";
 


const router = createHashRouter([
  {
    path: '/',
    element: <RouteHandler />,
    children: [
      {
        path: '/',
        element: <Splash />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/config',
        element: <Config />,
      },
      {
        path: '/restore',
        element: <Restore />,
      },
    ]
  },
]);

const App: FC = () => {
  const [opened, {open, close}] = useDisclosure(false);

    return (
      <Provider store={store}>
        <MantineProvider>
          <Notifications/>
          <Header openMenu={open}/>
          <Menu state={opened} closeFunction={close} />
          <RouterProvider router={router}/>
          <Log/>
        </MantineProvider>
      </Provider>
    );
};

export default App;
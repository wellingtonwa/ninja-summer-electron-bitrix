import React, { FC, useEffect, useRef } from "react";
import {ActionIcon, Center, Grid, MantineProvider, Title} from "@mantine/core";
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RouteHandler from "./components/routerHandler/RouterHandler";
import Home from "./page/Home";
import Config from "./page/Config";
import { Provider } from "react-redux"
import store from './store';
import Splash from "./page/Splash";
import { Notifications } from "@mantine/notifications";
import Restore from "./page/Restore";
import { IconMenu2 } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Menu from "./page/Menu";
import Log, { LogRefProps } from "./page/Log";


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
          <Menu state={opened} closeFunction={close} />
          <Grid>
            <Grid.Col span={1}>
              <ActionIcon onClick={() => open()} variant='filled'>
                <IconMenu2/>
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={9}>
              <Center>
                <Title order={1}>Ninja Summer Electron Bitrix</Title>
              </Center>
            </Grid.Col>
          </Grid>
          <RouterProvider router={router}/>
        </MantineProvider>
      </Provider>
    );
};

export default App;
import { ActionIcon, Center, Grid, Paper, Space, Title } from '@mantine/core';
import React, { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MAP_SCREEN_STATE } from '../../../model/enumerated/screenState.enum';
import { EVENT_SCREEN_STATE_CHANGE } from '../../../constants';
import { IconMenu2 } from '@tabler/icons-react';
import Menu from '../../../react/page/Menu';
import { useDisclosure } from '@mantine/hooks';
import Log from '../../../react/page/Log';

const RouteHandler: FC = () => {
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);

    useEffect(
      () => {
        ninja.on(EVENT_SCREEN_STATE_CHANGE, (state: string) => navigate(MAP_SCREEN_STATE[state]));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <>
        <Paper mx="auto" mt={'xl'}>
          <Space h={'xl'}/>
          <Outlet/>
        </Paper>
      </>
    )

};

export default RouteHandler;
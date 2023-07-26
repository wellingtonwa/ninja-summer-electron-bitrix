import { Paper, Space } from '@mantine/core';
import React, { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MAP_SCREEN_STATE } from '../../../model/enumerated/screenState.enum';
import { EVENT_SCREEN_STATE_CHANGE } from '../../../constants';

const RouteHandler: FC = () => {
    const navigate = useNavigate();

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
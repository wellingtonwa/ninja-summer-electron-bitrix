import { ActionIcon, Center, Grid, Title } from '@mantine/core';
import { IconArticle, IconArticleOff, IconMenu2 } from '@tabler/icons-react';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { GlobalState, globalActions } from '../store/slice/global.slice';

export interface HeaderProps {
  openMenu: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const { logVisible } = useSelector<RootState, GlobalState>(state => state.global);
  const dispatch = useDispatch();

  return <>
    <Grid justify="space-around" align="center">
      <Grid.Col span={1}>
        <ActionIcon onClick={props.openMenu} variant='filled'>
          <IconMenu2/>
        </ActionIcon>
      </Grid.Col>
      <Grid.Col span={8}>
        <Center>
          <Title order={1}>Ninja Summer Electron Bitrix</Title>
        </Center>
      </Grid.Col>
      <Grid.Col span={2}>
        <ActionIcon onClick={() => dispatch(globalActions.logToggle(''))}>
          {!logVisible && <IconArticle/>}
          {logVisible && <IconArticleOff/>}
        </ActionIcon>
      </Grid.Col>
    </Grid>
  </>

}

export default Header;
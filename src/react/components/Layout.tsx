import React, { FC } from "react";
import { Outlet } from 'react-router-dom';
import Header from '../page/Header';
import Menu from '../page/Menu';
import Log from '../page/Log';
import { useDisclosure } from "@mantine/hooks";

const Layout: FC = () => {
  
  const [opened, {open, close}] = useDisclosure(false);

  return <>
    <Header openMenu={open}/>
    <Menu state={opened} closeFunction={close} />
    <Outlet/>
    <Log/>
  </>

}

export default Layout;

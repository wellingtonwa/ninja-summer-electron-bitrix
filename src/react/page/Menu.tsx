import { Drawer, NavLink } from "@mantine/core";
import React, { FC, useRef } from "react";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { useDisclosure } from "@mantine/hooks";
import { IconDashboard, IconDatabase, IconSettings } from "@tabler/icons-react";
import Log, { LogRefProps } from "./Log";

export interface MenuProps {
  state: boolean;
  closeFunction: () => void;
}

const Menu: FC<MenuProps> = (props) => {

  const navigateTo = (value: ScreenState) => {
    ninja.main.setScreenState(value); 
    props.closeFunction();
  }

  return (
    <>
      <Drawer opened={props.state} onClose={props.closeFunction}>
        <NavLink
          label="Dashboard"
          onClick={() => navigateTo(ScreenState.HOME)}
          icon={<IconDashboard/>}
        />
        <NavLink
          label="Configurações"
          onClick={() => navigateTo(ScreenState.CONFIG)}
          icon={<IconSettings/>}
        />
        <NavLink
          label="Restaurar DB"
          onClick={() => navigateTo(ScreenState.RESTORE)}
          icon={<IconDatabase/>}
        />
      </Drawer>
    </>
  )

}

export default Menu;
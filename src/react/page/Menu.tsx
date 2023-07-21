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
  const elementRef = useRef<LogRefProps>();

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
        <NavLink
          label="Mostra Log"
          onClick={() => elementRef.current.showFunction()}
          icon={<IconDatabase/>}
        />
      </Drawer>
      <Log ref={elementRef}/>
    </>
  )

}

export default Menu;
import { Drawer, NavLink } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { useDisclosure } from "@mantine/hooks";
import { IconDashboard, IconDatabase, IconSettings } from "@tabler/icons-react";
import Log, { LogRefProps } from "./Log";

export interface MenuProps {
  state: boolean;
  closeFunction: () => void;
}

const Menu: FC<MenuProps> = (props) => {
  
  const [version, setVersion] = useState<String>('');

  useEffect(() => {
    findVersion();
  }, []);

  const findVersion = async () => {
    setVersion(await ninja.main.getVersion());
  }

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
          label="Restaurar DB"
          onClick={() => navigateTo(ScreenState.RESTORE)}
          icon={<IconDatabase/>}
        />
        <NavLink
          label="Configurações"
          onClick={() => navigateTo(ScreenState.CONFIG)}
          icon={<IconSettings/>}
        />
        <p>
          Versão: {version}
        </p>
      </Drawer>
    </>
  )

}

export default Menu;

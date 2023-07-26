import React, { FC, useState, useEffect } from "react";
import { Affix, Box, Collapse, Dialog, Textarea, rem } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { GlobalState, globalActions } from "../store/slice/global.slice";
import { EVENT_APPEND_LOG } from "../../constants";


export interface LogRefProps {
  currentState: () => boolean;
  showFunction: () => void;
  closeFunction: () => void;
};

const Log:FC = () => {
  
  const dispatch = useDispatch();
  const {logVisible} = useSelector<RootState, GlobalState>(state => state.global);
  const [texto, setTexto] = useState("");

  useEffect(
    () => {
      ninja.on(EVENT_APPEND_LOG, appendLog);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const closeLog = () => {
    dispatch(globalActions.setLogVisible(false));
  }

  const appendLog = (txt: string) => {
    setTexto(prevState => `> ${txt}\n${prevState}`);
  };

  return (
    <>
        <Affix position={{ bottom: rem(20), right: rem(20) }} style={{width: '95%'}}>
          <Collapse in={logVisible} transitionDuration={1000}>
            <Box sx={(theme)=>({ backgroundColor: theme.colors.dark[4]})} p="xs">
              <Textarea value={texto} label="Mensagens:" size="md" minRows={6} maxRows={6} />
            </Box>
          </Collapse>      
        </Affix>
    </>
  );

};

export default Log;
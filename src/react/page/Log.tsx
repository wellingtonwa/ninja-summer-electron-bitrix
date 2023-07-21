import { Button, Dialog, Textarea } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import React, { FC, useState, forwardRef, useImperativeHandle, useRef } from "react";


export interface LogRefProps {
  currentState: () => boolean;
  showFunction: () => void;
  closeFunction: () => void;
};

interface Props {

};

const Log = forwardRef<LogRefProps, Props>((props, ref) => {
  const [opened, {open, close}] = useDisclosure(false);
  const [texto, setTexto] = useState("");
  const componentRef = useRef<LogRefProps>();

  const appendLog = (txt: string) => {
    setTexto(prevState => txt + "\n" + prevState);
  };

  useImperativeHandle(ref, () => {
    return {
      currentState() {
        return opened;
      },
      showFunction() {
        open();
      },
      closeFunction() {
        close();
      }
    }
  });


  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={} size="lg" radius="md">
        <Textarea value={texto} label="Mensagens:" size="md" minRows={6} maxRows={6}/>
      </Dialog>      
    </>
  );

});

export default Log;
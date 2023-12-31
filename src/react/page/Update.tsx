import React, { FC, useEffect } from "react";
import { Title, Center, Group } from "@mantine/core";

const Update: FC = () => {

  useEffect(() => {
    localStorage.clear();
  });

  return <>
    <Center mx="auto">
      <Title order={1}>Atualizando APP</Title>
    </Center>
    <Center mx="auto">
      <Title order={4}>Aguarde por favor</Title>
    </Center>
  </>

}

export default Update;

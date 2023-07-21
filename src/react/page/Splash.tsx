import React, { FC, useEffect } from "react";
import { Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { MAP_SCREEN_STATE } from "../../model/enumerated/screenState.enum";

const Splash: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    init()
  }, []);

  const init = async() => {
    navigate(MAP_SCREEN_STATE[await ninja.main.getScreenState()]);
  }

  return (
    <>
      <Title>
        Bem vindo ao Ninja
      </Title>
    </>
  );

};

export default Splash;
import React, { FC, useEffect, useState } from "react";
import { Grid } from "@mantine/core";
import { GlobalState, globalActions } from '../../react/store/slice/global.slice';
import { RootState } from '../../react/store';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import { ScreenState } from "../../model/enumerated/screenState.enum";
import IssueCard from "../components/issueCard/IssueCard";
import Database from "../../model/Database";

const Home: FC = () => {

    const { pictures, currentPicture } = useSelector<RootState, GlobalState>(state => state.global)
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ databases, setDatabases ] = useState<Database[]>([])

    useEffect(() => {   
      setLoading(true);
      hasConnection();
      findDbNames();
      setLoading(false);
    }, []);

    const hasConnection = async () => {
      if (!await ninja.postgres.hasConnection()) {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Não possível connectar ao banco de dados. Verifique as configurações.'
        });
        ninja.main.setScreenState(ScreenState.CONFIG);
      }
    }

    const findDbNames = async () => {
      setDatabases(await ninja.dashboard.getDbnames());
    }
    
    return (
        <>
          <Grid>
            {databases.map(it => <Grid.Col sm={12} md={6} xl={4} children={<IssueCard database={it}/>}/>)}
          </Grid>
        </>
    )

}

export default Home;
import React, { FC, useEffect, useRef, useState } from "react";
import { Grid } from "@mantine/core";
import { useDispatch } from "react-redux";
import { notifications } from '@mantine/notifications';
import { ScreenState } from "../../model/enumerated/screenState.enum";
import IssueCard from "../components/issueCard/IssueCard";
import Database from "../../model/Database";
import { LogRefProps } from "./Log";
import { REGEX_NUMEROCASO } from "../../constants";

const Home: FC = () => {

    const [ loading, setLoading ] = useState<boolean>(false)
    const [ databases, setDatabases ] = useState<Database[]>([])
    const dispatch = useDispatch();
    const elementRef = useRef<LogRefProps>();

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

    const dropDatabaseAction = async (databaseName: Database) => {
      ninja.main.appendLog(`Dropando base de dados: ${databaseName.dbname}`);
      await ninja.postgres.dropDatabase(databaseName.dbname);
      await findDbNames();
    }

    function getNumeroCaso(item: Database) {
      const numeroCaso = item && item.dbname && REGEX_NUMEROCASO.test(item.dbname) && item.dbname.match(REGEX_NUMEROCASO);
      return numeroCaso ? numeroCaso[0] : null;
    }
    
    const openFolder = async (database: Database) => {
      const numeroCaso = getNumeroCaso(database);
      if(numeroCaso) {
        await ninja.fileManager.openFolder(getNumeroCaso(database));
      } else {
        notifications.show({
          message: "Não foi encontrado o número do caso no nome do banco de dados.",
        })
      }
    }

    return (
        <>
          <Grid>
            {databases.map(it => <Grid.Col sm={12} md={6} xl={4} children={<IssueCard database={it} dropDatabaseAction={dropDatabaseAction} openFolderAction={openFolder}/>}/>)}
          </Grid>
        </>
    )

}

export default Home;
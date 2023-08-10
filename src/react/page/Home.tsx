import React, { FC, useEffect, useRef, useState } from "react";
import { Grid } from "@mantine/core";
import { useDispatch } from "react-redux";
import { notifications } from '@mantine/notifications';
import { ScreenState } from "../../model/enumerated/screenState.enum";
import IssueCard from "../components/issueCard/IssueCard";
import Database from "../../model/Database";
import { LogRefProps } from "./Log";
import { REGEX_NUMEROCASO } from "../../constants";
import { isNull, isEmpty } from "lodash";
import InformacaoBitrix from "../../model/informacaoBitrix";

const Home: FC = () => {

    const [ loading, setLoading ] = useState<boolean>(false)
    const [ databases, setDatabases ] = useState<Database[]>([])
    const [ dadosBitrix, setDadosBitrix ] = useState<InformacaoBitrix[]>([]);
    const dispatch = useDispatch();
    const elementRef = useRef<LogRefProps>();

    useEffect(() => {   
      setLoading(true);
      hasConnection();
      findDbNames();
      setLoading(false);
    }, []);

    useEffect(() => {
      findDadosBitrix();      
    }, [databases]);

    function getNumeroTarefa(item: Database) {
      const numeroCaso = item && item.dbname && REGEX_NUMEROCASO.test(item.dbname) && item.dbname.match(REGEX_NUMEROCASO);
      return numeroCaso ? numeroCaso[0] : null;
    }

    const findDadosBitrix = async () => {
      if (await ninja.bitrix.isActive()) {
        const numerosTarefas = databases.map(it => getNumeroTarefa(it)).filter(it => !isNull(it));
        ninja.bitrix.getDadosTarefa(numerosTarefas).then((result: InformacaoBitrix[]) => {
          setDadosBitrix(result);
        });
      } else if (databases.length > 0) {
          showBitrixDesativado();
      }
    }
    
    const findDadosTarefa = async (numeroTarefa: string) => {
        if (await ninja.bitrix.isActive() && numeroTarefa) {
            ninja.bitrix.getDadosTarefa(numeroTarefa).then((result: InformacaoBitrix[]) => {
                if (!isEmpty(result)) {
                  setDadosBitrix(dadosBitrix.map(p => p.id === numeroTarefa ? result[0] : p));
                }
            });
        } else {
            showBitrixDesativado();
        }

    }

    const showBitrixDesativado = () => {
        notifications.show({
          title: 'Informação',
          color: 'blue',
          message: 'A url de integração com o Bitrix não foi definida. Para definir acesse as configurações.'
        });
    }

    const findComentarios = async () => {
        console.log(await ninja.bitrix.getComentariosTarefa('33044'));
    }

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
      const result = await ninja.dashboard.getDbnames();
      setDatabases(result.map((it: Database) => ({isTarefa: getNumeroTarefa(it) !== null, ...it})));
    }

    const dropDatabaseAction = async (databaseName: Database) => {
      ninja.main.appendLog(`Dropando base de dados: ${databaseName.dbname}`);
      try {
        await ninja.postgres.dropDatabase(databaseName.dbname);
      } catch (error) {
        ninja.main.appendLog(`Erro ao apagar o banco de dados: ${databaseName.dbname}. Detalhes: ${error}`);
      }
      await findDbNames();
    }

    const openFolder = async (database: Database) => {
      const numeroCaso = getNumeroTarefa(database);
      if(numeroCaso) {
        await ninja.fileManager.openFolder(getNumeroTarefa(database));
      } else {
        notifications.show({
          message: "Não foi encontrado o número do caso no nome do banco de dados.",
        })
      }
    }

    const titleClick = (url: string) => {
      ninja.main.openLink(url);
    }

    return (
        <>
          <Grid>
            {databases.map(it => 
              <Grid.Col sm={12} md={6} xl={4} key={it.dbname} children={
                <IssueCard 
                  database={it} 
                  dropDatabaseAction={dropDatabaseAction} 
                  openFolderAction={openFolder}
                  informacaoBitrix={dadosBitrix.find(ib => ib?.id === getNumeroTarefa(it))}
                  issueRefreshClick={findDadosTarefa}
                  issueTitleClick={titleClick}
                  />
              }/>
            )}
          </Grid>
        </>
    )

}

export default Home;

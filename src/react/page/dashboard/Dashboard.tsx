import React, { FC, useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure, useFocusTrap } from '@mantine/hooks';
import { Grid, TextInput, Box, Group, ActionIcon, Text, Modal, Divider, Title } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { REGEX_NUMEROCASO } from "../../../constants";
import { isNull, isEmpty } from "lodash";
import DadosCasoSkeleton from "../../components/dadosCaso/DadosCasoSkeleton";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import { ScreenState } from "../../../model/enumerated/screenState.enum";
import IssueCard from "../../components/issueCard/IssueCard";
import DadosCaso from "../../components/dadosCaso/DadosCaso";
import Database from "../../../model/Database";

const Dashboard: FC = () => {

  const [ databases, setDatabases ] = useState<Database[]>([])
  const [ loadingIssues, setLoadingIssues ] = useState<string[]>([]);
  const [ fieldDbname, setFieldDbname ] = useState<string>(null);
  const [ fieldDbnameDebounced ] = useDebouncedValue(fieldDbname, 500);
  const searchFieldFocusTrap = useFocusTrap(true);

  useEffect(() => {   
    hasConnection();
    findDbNames();
  }, []);

  useEffect(() => {   
    findDbNames();
  }, [fieldDbnameDebounced]);

  function getNumeroTarefa(item: Database) {
    const numeroCaso = item && item.dbname && REGEX_NUMEROCASO.test(item.dbname) && item.dbname.match(REGEX_NUMEROCASO);
    return numeroCaso ? numeroCaso[0] : null;
  }

  const findDadosBitrix = async (param: Database[]) => {
    if (await ninja.bitrix.isActive() && param) {
      const numerosTarefas = param.map(it => getNumeroTarefa(it)).filter(it => !isNull(it));
      setLoadingIssues(numerosTarefas);
      ninja.bitrix.getDadosTarefa(numerosTarefas).then((result: InformacaoBitrix[]) => {
        let dados: Database[] = [];
        for (const database of param) {
          const informacaoBitrix = result.find(informacaoBitrix => informacaoBitrix.id === getNumeroTarefa(database));
          informacaoBitrix ? dados.push({...database, ...{ informacaoBitrix, isTarefa: true }}) : dados.push(database); 
        }
        setDatabases(dados);
      });
      setLoadingIssues([]);
    } else if (param && param.length > 0) {
      setDatabases(param);
      showBitrixDesativado();
    } else {
      setDatabases([]);
    }
  }
  
  const findDadosTarefa = async (numeroTarefa: string) => {
    if (await ninja.bitrix.isActive() && numeroTarefa) {
      // Colocando a tarefa com status de loading;
      setLoadingIssues([...loadingIssues, ...[numeroTarefa]]);
      ninja.bitrix.getDadosTarefa(numeroTarefa).then((result: InformacaoBitrix[]) => {
        if (!isEmpty(result)) {
          setDatabases(databases.map(p => p.isTarefa && p.informacaoBitrix.id === numeroTarefa ? {...p, ...{informacaoBitrix: result[0]}} : p));
        }
        setLoadingIssues(loadingIssues.splice(loadingIssues.indexOf(numeroTarefa), 1));
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
    findDadosBitrix(await ninja.dashboard.getDbnames(fieldDbnameDebounced));  
  }

  const dropConfirmation = async (database: Database) => {
    modals.openConfirmModal({
      title: 'Atenção',
      children: (
        <Text size="sm">
          Deseja realmente apagar a base de dados '{database.dbname}'?
        </Text>
      ),
      labels: { confirm: 'Sim', cancel: 'Não' },
      confirmProps: {color: 'red'},
      onConfirm: () => dropDatabaseAction(database)
    })
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

  const renderDadosTarefa = (informacaoBitrix: InformacaoBitrix) => {
    const isLoading: boolean = loadingIssues.indexOf(informacaoBitrix.id) >=0;
    return ( <>
      {isLoading ? <DadosCasoSkeleton/> : <DadosCaso dadosCaso={informacaoBitrix} titleClick={titleClick} />}
    </>);
  }

  return (
    <>
      <Box mb="xs" ref={searchFieldFocusTrap}>
        <Group grow>
          <TextInput 
            placeholder="Pesquise o nome do banco" 
            onChange={event => setFieldDbname(event.currentTarget.value)} />
        </Group>
      </Box>
      <Grid>
        {databases.map(it => 
          <Grid.Col sm={12} md={6} xl={4} key={it.dbname} children={
            <IssueCard 
              database={it} 
              dropDatabaseAction={dropConfirmation} 
              openFolderAction={openFolder}
              issueRefreshClick={findDadosTarefa}
              issueTitleClick={titleClick}
              >
              {it.informacaoBitrix && renderDadosTarefa(it.informacaoBitrix)}
            </IssueCard>
          }/>
        )}
      </Grid>
    </>
  )

}

export default Dashboard;

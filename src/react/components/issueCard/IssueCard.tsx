import React, {ReactNode} from "react";
import { IconClipboard, IconRefresh } from '@tabler/icons-react'
import { Button, Title, Group, ActionIcon, Tooltip, ColorSwatch, Card, SimpleGrid} from "@mantine/core";
import Database from "../../../model/Database";
import DadosCaso from "../dadosCaso/DadosCaso";
import {useClipboard} from "@mantine/hooks";
import InformacaoBitrix from "../../../model/informacaoBitrix";


interface IssueCardProps {
  database: Database;
  informacaoBitrix?: InformacaoBitrix;
  openFolderAction: (database: Database) => void;
  dropDatabaseAction: (database: Database) => void;
  issueRefreshClick?: (numeroTarefa: string) => void;
  issueTitleClick?: (url: string) => void;
  children?: ReactNode;
}

const IssueCard = (props: IssueCardProps) => {

  const {database, informacaoBitrix, openFolderAction, dropDatabaseAction, issueRefreshClick} = props;
  const clipboard = useClipboard({timeout: 500});

  return (
      <Card shadow="xl" p="md" style={ {backgroundColor: '#5C5f66'}} >
        <Group spacing="xs">
          {database.isTarefa && <Tooltip label={informacaoBitrix?.etapa?.TITLE}>
              <ColorSwatch color={`#${informacaoBitrix?.etapa?.COLOR}`}/>
          </Tooltip>}
          <Title order={3}>{database.dbname}</Title>
          <Tooltip label="Copiar nome do banco de dados">
            <ActionIcon component={IconClipboard} onClick={() => clipboard.copy(database.dbname)}/>
          </Tooltip>
          {database.isTarefa && <Tooltip label="Atualizar as informações da tarefa">
            <ActionIcon component={IconRefresh} onClick={() => issueRefreshClick(informacaoBitrix.id)}/>
          </Tooltip>}
        </Group>
	<SimpleGrid cols={1}>
	<div>
          {informacaoBitrix && <DadosCaso dadosCaso={informacaoBitrix} titleClick={props.issueTitleClick}/>}
          {props.children}
	</div>
	<Group sx={(theme: any) => ({
          marginTop: 10,
        })}>
          <Button color="red" onClick={() => dropDatabaseAction(database)}>Apagar</Button>
          <Button onClick={() => openFolderAction(database)}>Abrir Pasta</Button>
        </Group>
	</SimpleGrid>
      </Card>
  )

}

export default IssueCard;

import React, {ReactNode} from "react";
import { IconClipboard } from '@tabler/icons-react'
import {Paper, Button, Title, Group, ActionIcon} from "@mantine/core";
import Database from "../../../model/Database";
import DadosCaso from "../dadosCaso/DadosCaso";
import {useClipboard} from "@mantine/hooks";
import InformacaoBitrix from "../../../model/informacaoBitrix";


interface IssueCardProps {
  database: Database;
  informacaoMantis?: InformacaoBitrix;
  openFolderAction: (database: Database) => void;
  dropDatabaseAction: (database: Database) => void;
  children?: ReactNode;
}

const IssueCard = (props: IssueCardProps) => {

  const {database, informacaoMantis, openFolderAction, dropDatabaseAction} = props;
  const clipboard = useClipboard({timeout: 500});

  const paperStyle = (theme: any, estado: string | undefined) => ({
      backgroundColor: `#${estado}`
  });

  return (
      <Paper shadow="xl" p="md" sx={theme => paperStyle(theme, informacaoMantis?.etapa?.COLOR || '5C5f66')} >
        <Group spacing="xs">
          <Title order={3}>{database.dbname}</Title>
          <ActionIcon component={IconClipboard} onClick={() => clipboard.copy(database.dbname)}/>
        </Group>

        <Group direction="row" position="apart" sx={(theme: any) => ({
          marginTop: 10,
        })}>
          {informacaoMantis && <DadosCaso dadosCaso={informacaoMantis}/>}
          {props.children}
          <Button color="red" onClick={() => dropDatabaseAction(database)}>Apagar</Button>
          <Button onClick={() => openFolderAction(database)}>Abrir Pasta</Button>
        </Group>
      </Paper>
  )

}

export default IssueCard;
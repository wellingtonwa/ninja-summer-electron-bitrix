import React, {ReactNode, useState} from "react";
import { isArray } from "lodash";
import { notifications } from "@mantine/notifications";
import {useClipboard, useDisclosure} from "@mantine/hooks";
import { Title, Group, ActionIcon, Tooltip, ColorSwatch, Card, SimpleGrid, Indicator, Text } from "@mantine/core";
import { IconClipboard, IconFileDownload, IconFolderOpen, IconMessageCircle, IconRefresh, IconTrashXFilled } from '@tabler/icons-react'
import Database from "../../../model/Database";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import AttachedObjectBitrix from "../../../model/bitrix/attachedObjectBitrix";
import ArquivosView from "../../page/dashboard/ArquivosView";
import ComentariosView from "../../page/dashboard/ComentariosView";
import ComentarioBitrix from "../../../model/comentarioBitrix";


interface IssueCardProps {
  database: Database;
  openFolderAction: (database: Database) => void;
  dropDatabaseAction: (database: Database) => void;
  issueRefreshClick?: (numeroTarefa: string) => void;
  issueTitleClick?: (url: string) => void;
  children?: ReactNode;
}

const IssueCard = (props: IssueCardProps) => {
  const [ openedComments, openedCommentsHandlers ] = useDisclosure(false);
  const [ loadingComments, setLoadingComments ] = useState<boolean>(true);
  const [ comments, setComments ] = useState<ComentarioBitrix[]>([]);
  const [ openedArquivos, openedArquivosHandlers ] = useDisclosure(false);
  const [ loadingArquivos, setLoadingArquivos ] = useState<boolean>(true);
  const [ arquivos, setArquivos ] = useState<AttachedObjectBitrix[]>([]);
  const {database, openFolderAction, dropDatabaseAction, issueRefreshClick } = props;
  const clipboard = useClipboard({timeout: 500});
  const hasAttachments = isArray(database?.informacaoBitrix?.attachments);

  const findComentarios = async (informacaoBitrix: InformacaoBitrix) => {
    setLoadingComments(true);
    try {
      setComments(await ninja.bitrix.getComentariosTarefa(informacaoBitrix.id));
      openedCommentsHandlers.open();
    } catch (error) {
      ninja.main.appendLog(`Erro ao carregar comentários: ${error}`)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Não foi possível carregar os comentários.',
      });
    } finally {
      setLoadingComments(false);
    }
  }

  const findArquivos = async (informacaoBitrix: InformacaoBitrix) => {
    setLoadingArquivos(true);
    try {
      setArquivos(await ninja.bitrix.getArquivos(informacaoBitrix?.attachments));
      openedArquivosHandlers.open();
    } catch (error) {
      ninja.main.appendLog(`Erro ao carregar arquivos: ${error}`)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Não foi possível carregar os arquivos.',
      });
    } finally {
      setLoadingArquivos(false);
    }
  }

  return (
    <>
      <ComentariosView 
        opened={openedComments} 
        close={openedCommentsHandlers.close} 
        comments={comments}
        informacaoBitrix={database.informacaoBitrix}
      />
      <ArquivosView 
        title={<Text size="xl" fw={700}>Arquivos</Text>}
        opened={openedArquivos} 
        close={openedArquivosHandlers.close} 
        arquivos={arquivos}
        informacaoBitrix={database.informacaoBitrix}
      />
    
      <Card shadow="xl" p="md" style={ {backgroundColor: '#5C5f66'}} >
        <Group spacing="xs">
          {database.isTarefa && <Tooltip label={database?.informacaoBitrix?.etapa?.TITLE}>
              <ColorSwatch color={`#${database?.informacaoBitrix?.etapa?.COLOR}`}/>
          </Tooltip>}
          <Title order={3}>{database.dbname}</Title>
          <Tooltip label="Copiar nome do banco de dados">
            <ActionIcon component={IconClipboard} onClick={() => clipboard.copy(database.dbname)}/>
          </Tooltip>
          {database.isTarefa && <Tooltip label="Atualizar as informações da tarefa">
            <ActionIcon component={IconRefresh} onClick={() => issueRefreshClick(database?.informacaoBitrix.id)}/>
          </Tooltip>}
        </Group>
        <SimpleGrid cols={1}>
          <div>
            {props.children}
          </div>
          <Group sx={(theme: any) => ({
                marginTop: 10,
                })}>
            <Tooltip label="Apagar base de dados">
              <ActionIcon 
                onClick={() => dropDatabaseAction(database)}
                size="lg"
                color="red"
                variant="filled"
              >
                <IconTrashXFilled/>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Abrir pasta da tarefa">
              <ActionIcon 
                onClick={() => openFolderAction(database)} 
                size="lg"
                color="blue"
                variant="filled"
              >
                <IconFolderOpen/>
              </ActionIcon>
            </Tooltip>
            {hasAttachments && <>
              <Tooltip label="Mostrar arquivos anexados na tarefa">
                <Indicator inline label={database?.informacaoBitrix?.attachments?.length} size={12}>
                  <ActionIcon 
                    onClick={() => findArquivos(database?.informacaoBitrix)}
                    size="lg"
                    color="blue"
                    variant="filled"
                  >
                    <IconFileDownload/>
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            </>}
            {database.isTarefa && <Tooltip label={'Mostrar comentários'}>
              <ActionIcon 
                onClick={() => findComentarios(database?.informacaoBitrix)}
                size="lg"
                color="blue"
                variant="filled"
              >
                <IconMessageCircle/>
              </ActionIcon>
            </Tooltip>}
          </Group>
        </SimpleGrid>
      </Card>
    </>
  )

}

export default IssueCard;

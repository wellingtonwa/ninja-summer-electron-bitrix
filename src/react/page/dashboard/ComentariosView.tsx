import React, { FC } from 'react';
import { Accordion, ActionIcon, Box, Divider, Modal, rem, Table, Text, Title, useMantineTheme } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import ComentarioBitrix from "../../../model/comentarioBitrix";
import CommentAttachmentBitrix from '../../../model/bitrix/commentAttachmentBitrix';
import InformacaoBitrix from '../../../model/informacaoBitrix';
import { IconDownload, IconFile } from '@tabler/icons-react';
import parser from 'bbcode-to-react';

interface ComentariosViewProps {
  opened: boolean;
  close: () => void; 
  comments: ComentarioBitrix[];
  informacaoBitrix: InformacaoBitrix;
}

const ComentariosView: FC<ComentariosViewProps> = props => {
  
  const HTML_ENTITIES = [/&quot;/gm, /&gt;/gm, /&lt;/gm, /&#39;/gm, /&amp;/gm];
  const HTML_ENTITIES_REPLACEMENT = ['"', '>', '<', '\'', '&'];
  const theme = useMantineTheme();

  const convertEntities = (text: string) => {
    let retorno = text;
    for (let i = 0; i < HTML_ENTITIES.length; i++) {
      retorno = retorno.replace(HTML_ENTITIES[i], HTML_ENTITIES_REPLACEMENT[i]);
    }
    return retorno;
  }

  const downloadCommentAttachment = (commentAttachment: CommentAttachmentBitrix) => {
    try {
      ninja.bitrix.downloadCommentAttachment(commentAttachment, props.informacaoBitrix);
      notifications.show({
        title: 'Informação',
        color: 'blue',
        message: `O arquivo '${commentAttachment.NAME}' foi baixado para a pasta da tarefa.`
      });
    } catch (error) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Ocorreu um erro ao baixar o arquivo. Mais informações estão disponíveis no log.'
      });
      ninja.main.appendLog(`Erro ao baixar arquivo. Detalhes: ${error}`);
    }
  }

  const getColor = (color: string) => theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

  const renderAttachmentsRows = (attachments: any) => {
    return Object.keys(attachments).map((attachmentId: any) => (
      <tr key={attachments[attachmentId].ATTACHMENT_ID}>
        <td>{attachments[attachmentId].NAME}</td>
        <td>{(Number(attachments[attachmentId].SIZE)/1024).toFixed(2)} Kb</td>
        <td>
          <ActionIcon onClick={() => downloadCommentAttachment(attachments[attachmentId])}>
            <IconDownload/>
          </ActionIcon>
        </td>
      </tr>
    ))
  }

  const renderCommentAttchments = (comment: ComentarioBitrix) => {
    return <>
            <Divider/>
            <Accordion>
              <Accordion.Item value="attachments">
                <Accordion.Control icon={<IconFile size={rem(20)} color={getColor('red')}/>}>Arquivo(s)</Accordion.Control>
                <Accordion.Panel>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderAttachmentsRows(comment.ATTACHED_OBJECTS)}
                    </tbody>
                  </Table>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </>
  }

  return <>
      <Modal 
        title={
          <>Comentários da tarefa {props?.informacaoBitrix?.id}</>
        }
        opened={props.opened} 
        onClose={props.close} fullScreen>
        <>
        {props.comments.map((dado: ComentarioBitrix) => <>
            <Box key={dado.ID} sx={(theme) => 
              ({backgroundColor: theme.colors.dark[5]})} 
              m="xs"
              p="xs"
              >
              <Text size="xl" fw={700}>
                {dado.AUTHOR_NAME} - {dado.POST_DATE}
              </Text>
              <Divider/>
              <Text style={{whiteSpace: "pre-line"}}>
                {parser.toReact(convertEntities(dado.POST_MESSAGE))}
              </Text>
              {dado.ATTACHED_OBJECTS && renderCommentAttchments(dado)}
            </Box>
          </>)}
        </>
      </Modal>
  </>;
}

export default ComentariosView;

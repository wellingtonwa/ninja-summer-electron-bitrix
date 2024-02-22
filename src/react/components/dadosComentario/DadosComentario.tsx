import React, { FC } from 'react';
import ComentarioBitrix from '../../../model/comentarioBitrix';
import CommentAttachmentBitrix from '../../../model/bitrix/commentAttachmentBitrix';
import InformacaoBitrix from '../../../model/informacaoBitrix';
import { IconDownload, IconFile } from '@tabler/icons-react';
import { Accordion, ActionIcon, Box, Divider, rem, Table, Text, useMantineTheme } from '@mantine/core';
import parser from 'bbcode-to-react';
import { notifications } from '@mantine/notifications';

interface DadosComentarioProps {
  comments?: ComentarioBitrix[];
  dadosTarefa?: InformacaoBitrix;
};

const DadosComentario: FC<DadosComentarioProps> = props => {

  const { comments, dadosTarefa } = props;
  const theme = useMantineTheme();
  const HTML_ENTITIES = [/&quot;/gm, /&gt;/gm, /&lt;/gm, /&#39;/gm, /&amp;/gm];
  const HTML_ENTITIES_REPLACEMENT = ['"', '>', '<', '\'', '&'];

  const convertEntities = (text: string) => {
    let retorno = text;
    for (let i = 0; i < HTML_ENTITIES.length; i++) {
      retorno = retorno.replace(HTML_ENTITIES[i], HTML_ENTITIES_REPLACEMENT[i]);
    }
    return retorno;
  }

  const downloadCommentAttachment = (commentAttachment: CommentAttachmentBitrix) => {
    try {
      ninja.bitrix.downloadCommentAttachment(commentAttachment, dadosTarefa);
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
    {comments.map((dado: ComentarioBitrix) => <>
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

} 

export default DadosComentario;

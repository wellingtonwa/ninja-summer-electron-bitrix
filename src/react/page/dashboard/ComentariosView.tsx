import React, { FC } from 'react';
import { Box, Divider, Modal, Text, Title } from "@mantine/core";
import ComentarioBitrix from "../../../model/comentarioBitrix";

const ComentariosView: FC = (props: {opened: boolean, close: () => void, comments: ComentarioBitrix[]}) => {
  
  const HTML_ENTITIES = [/&quot;/gm, /&gt;/gm, /&lt;/gm, /&#39;/gm];
  const HTML_ENTITIES_REPLACEMENT = ['"', '>', '<', '\''];

  const convertEntities = (text: string) => {
    let retorno = text;
    for (let i = 0; i < HTML_ENTITIES.length; i++) {
      retorno = retorno.replace(HTML_ENTITIES[i], HTML_ENTITIES_REPLACEMENT[i]);
    }
    return retorno;
  }

  return <>
      <Modal 
        title={
          <Title order={4}>Comentários da tarefa</Title>
        }
        opened={props.opened} 
        onClose={props.close} fullScreen>
        <>
        {props.comments.map((dado: ComentarioBitrix) => <>
            <Box sx={(theme) => 
              ({backgroundColor: theme.colors.dark[5]})} 
              m="xs"
              p="xs"
              >
              <Title order={3}>
                {dado.AUTHOR_NAME} - {dado.POST_DATE}
              </Title>
              <Divider/>
              <Text style={{whiteSpace: "pre-line"}}>
                {convertEntities(dado.POST_MESSAGE)}
              </Text>
            </Box>
          </>)}
        </>
      </Modal>
  </>;
}

export default ComentariosView;

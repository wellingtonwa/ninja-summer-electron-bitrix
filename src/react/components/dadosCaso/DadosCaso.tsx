import React from "react";
import { ActionIcon, Group, Image, SimpleGrid, Text, Tooltip } from "@mantine/core";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import { useClipboard } from "@mantine/hooks";
import { IconExternalLink, IconClipboard } from "@tabler/icons-react";

const link = "https://projetusti.bitrix24.com.br/workgroups/group/:groupId/tasks/task/view/:taskId/";

interface DadosCasoProps {
  dadosCaso: InformacaoBitrix;
  footerContent?: React.ReactNode | undefined; 
  titleClick?: (url: string) => void;
  viewCommentsCLick?: (dadosCaso: InformacaoBitrix) => void;
}


const DadosCaso = (props: DadosCasoProps) => {
  const { dadosCaso, footerContent } = props;
  const clipboard = useClipboard({timeout: 500});

  return <>
    <SimpleGrid cols={1} verticalSpacing="xs">
  	   <div>
        <Group noWrap>
          <Text>
            <b>Tarefa {dadosCaso.id}:</b> {dadosCaso.titulo}
          </Text>
          <Tooltip label={'Copiar título da tarefa'}>
            <ActionIcon component={IconClipboard} onClick={() => clipboard.copy(`Tarefa ${dadosCaso.id}: ${dadosCaso.titulo}`)}/>
          </Tooltip>
          <Tooltip label={'Abrir caso no Bitrix'}>
            <ActionIcon 
              onClick={() => props.titleClick(`${link.replace(':groupId', dadosCaso.group?.id ||'').replace(':taskId', dadosCaso.id||'')}`)}>
              <IconExternalLink/>
            </ActionIcon>
          </Tooltip>
        </Group>
       </div>
	   <div>
        <Group>
          <Text>
            Estado: 
          </Text>
          <Text>
            {dadosCaso?.etapa?.TITLE}
          </Text>
        </Group>
	   </div>
	   <div>
        <Group>
          <Text>Aberto em:</Text>
          <Text>{dadosCaso.createdDate}</Text>
        </Group>
	   </div>
	   <div>
        <Group>
          <Text>Cliente:</Text>
          <Text>{dadosCaso.codigoCliente}</Text>
        </Group>  
	   </div>
	   <div>
        <Group>  
	      <Text>Prioridade:</Text>
	      <Text>{dadosCaso.prioridade}</Text>
	    </Group>
	   </div>
	   <div>
        <Group>
          <Text>
            Criador:
          </Text> 
          <Image 
            maw={25}
            src={dadosCaso.creator?.icon} 
            title={dadosCaso.creator?.name} 
            alt="Imagem do criador no caso"
            radius="md"
          />
        </Group>
	   </div>
	   <div>
        <Group>
          <Text>Responsável:</Text> 
          <Image
            maw={25}
            src={dadosCaso.responsible?.icon} 
            title={dadosCaso.responsible?.name} 
            alt="Imagem do responsavel pelo caso"
            radius="md"
          />
        </Group>
	   </div>
    { footerContent }
    </SimpleGrid>
  </>
}

export default DadosCaso;

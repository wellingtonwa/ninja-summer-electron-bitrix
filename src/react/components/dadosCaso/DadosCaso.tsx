import React from "react";
import { ActionIcon, ColorSwatch, Group, Image, NavLink, SimpleGrid, Text, Tooltip } from "@mantine/core";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import { IconExternalLink } from "@tabler/icons-react";

const link = "https://projetusti.bitrix24.com.br/workgroups/group/:groupId/tasks/task/view/:taskId/";

interface DadosCasoProps {
  dadosCaso: InformacaoBitrix;
  titleClick?: (url: string) => void;
}


const DadosCaso = (props: DadosCasoProps) => {

  const { dadosCaso } = props;

  return <SimpleGrid cols={1}>
  	   <div>
            <Group noWrap>
              <Text>
                <b>Tarefa {dadosCaso.id}:</b> {dadosCaso.titulo}
              </Text>
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
          </SimpleGrid>
}

export default DadosCaso;

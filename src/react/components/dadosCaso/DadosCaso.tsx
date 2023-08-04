import React from "react";
import { ActionIcon, ColorSwatch, Group, Image, NavLink, Text, Tooltip } from "@mantine/core";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import { IconExternalLink } from "@tabler/icons-react";

const link = "https://projetusti.bitrix24.com.br/workgroups/group/:groupId/tasks/task/view/:taskId/";

interface DadosCasoProps {
  dadosCaso: InformacaoBitrix;
  titleClick?: (url: string) => void;
}


const DadosCaso = (props: DadosCasoProps) => {

  const { dadosCaso } = props;

  return <Text>
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
            <Group>
              <Text>
                Estado: 
              </Text>
              <Text>
                {dadosCaso?.etapa?.TITLE}
              </Text>
            </Group>
            <Group>
              <Text>Aberto em:</Text>
              <Text>{dadosCaso.createdDate}</Text>
            </Group>
            <Group>
              <Text>Cliente:</Text>
              <Text>{dadosCaso.codigoCliente}</Text>
            </Group>  
            <b>prioridade:</b> {dadosCaso.prioridade}<br/>
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
          </Text>
}

export default DadosCaso;
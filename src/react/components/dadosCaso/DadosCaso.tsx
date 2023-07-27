import React from "react";
import { ActionIcon, Group, NavLink, Text, Tooltip } from "@mantine/core";
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
            <b>Categoria:</b> NOT IMPLEMENTED<br/>
            <b>Estado:</b> {dadosCaso?.etapa?.TITLE}<br/>
            <b>Aberto em:</b> {dadosCaso.createdDate}<br/>
            <b>Cliente:</b> NOT IMPLEMENTED<br/>
            <b>prioridade:</b> {dadosCaso.prioridade}<br/>
            <b>Criador:</b> <img src={dadosCaso.creator?.icon} title={dadosCaso.creator?.name} alt="Imagem do criador no caso"/><br/>
            <b>Responsável:</b> <img src={dadosCaso.responsible?.icon} title={dadosCaso.responsible?.name} alt="Imagem do responsavel pelo caso"/>
          </Text>
}

export default DadosCaso;
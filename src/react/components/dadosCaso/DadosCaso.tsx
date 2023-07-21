import React from "react";
import { Text } from "@mantine/core";
import InformacaoBitrix from "../model/informacaoBitrix";

const link = "https://projetusti.bitrix24.com.br/workgroups/group/:groupId/tasks/task/view/:taskId/";

interface DadosCasoProps {
  dadosCaso: InformacaoBitrix;
}


const DadosCaso = (props: DadosCasoProps) => {

  const { dadosCaso } = props;

  return <Text>
            <a
                href={`${link.replace(':groupId', dadosCaso.group?.id ||'').replace(':taskId', dadosCaso.id||'')}`}
                rel="noopener noreferrer"
                target="_blank"
                title="Link para o caso"
            >
              <b>Tarefa {dadosCaso.id}:</b> {dadosCaso.titulo}<br/>
            </a>
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
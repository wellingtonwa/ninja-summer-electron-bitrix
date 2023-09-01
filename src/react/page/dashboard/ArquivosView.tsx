import React, { FC, ReactNode } from 'react';
import { ActionIcon, Modal, Table } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import AttachedObjectBitrix from "../../../model/bitrix/attachedObjectBitrix";
import InformacaoBitrix from '../../../model/informacaoBitrix';
import { notifications } from '@mantine/notifications';

interface ArquivosViewProps {
  title?: ReactNode; 
  opened: boolean; 
  close: () => void; 
  arquivos: AttachedObjectBitrix[];
  informacaoBitrix: InformacaoBitrix;
}

const ArquivosView: FC<ArquivosViewProps> = props => {

  const downloadAttachment = async (attachedObjectBitrix: AttachedObjectBitrix) => {
    try {
      await ninja.bitrix.downloadAttachment(attachedObjectBitrix, props.informacaoBitrix);
      notifications.show({
        title: 'Informação',
        color: 'blue',
        message: `O arquivo '${attachedObjectBitrix.NAME}' foi baixado para a pasta da tarefa.`
      })
    } catch (error) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Ocorreu um erro ao baixar o arquivo. Mais informações estão disponíveis no log.'
      });
      ninja.main.appendLog(`Erro ao baixar arquivo. Detalhes: ${error}`);
    }
  }

  const renderRows = () => {
    return props.arquivos.map(arquivo => (
      <tr key={arquivo.ID}>
        <td>{arquivo.NAME}</td>
        <td>{(Number(arquivo.SIZE)/1024).toFixed(2)} Kb</td>
        <td>
          <ActionIcon onClick={() => downloadAttachment(arquivo)}>
            <IconDownload/>
          </ActionIcon>
        </td>
      </tr>
    ))
  }

  return <>
    <Modal title={props.title} opened={props.opened} onClose={props.close} fullScreen>
      <Table striped>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tamanho</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </Table>
    </Modal>
  </>;

}

export default ArquivosView;

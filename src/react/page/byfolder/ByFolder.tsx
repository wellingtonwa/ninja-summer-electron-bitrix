import React, { FC, useEffect, useRef, useState } from "react";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import { getNumeroTarefa } from "../../../electron/utils/ninja.util";
import { notifications } from "@mantine/notifications";
import DadosCaso from "../../components/dadosCaso/DadosCaso";
import { ActionIcon, Box, Card, Group, Indicator, TextInput, Tooltip } from "@mantine/core";
import { useDebouncedValue, useFocusTrap } from "@mantine/hooks";
import { IconFolderOpen } from "@tabler/icons-react";
import { FolderInfo } from "../../../model/folderInfo";

const ByFolder: FC = () => {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const tarefas = useRef<InformacaoBitrix[]>([]);
  const [tarefasFiltradas, setTarefasFiltradas] = useState<Map<string, InformacaoBitrix>>(new Map());
  const [termoDePesquisa, setTermoDePesquisa] = useState<string>('');
  const [ fieldDbnameDebounced ] = useDebouncedValue(termoDePesquisa, 500);
  const searchFieldFocusTrap = useFocusTrap(true);

  useEffect(() => {
    findFolders();
  }, []);

  useEffect(() => {
    filterFolders(termoDePesquisa);
    console.log("Debounce happened!");
  }, [fieldDbnameDebounced])

  const findFolders = async () => {
    const pastas:FolderInfo[] = await ninja.byFolder.listFolder();
    setFolders(await ninja.byFolder.listFolder());
    tarefas.current = await ninja.bitrix.getDadosTarefa(pastas.map((pasta: FolderInfo) => getNumeroTarefa(pasta.nome)));
    filterFolders(termoDePesquisa);
  }
   
  const filterFolders = (termo: string) => { 
    let regexPesquisa: RegExp; 
    try {
      regexPesquisa = new RegExp(`.*${termo}.*`, 'gmi');
    } catch (error) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Não possível pesquisar o termo informado. Lembre-se que o campo de pesquisa é transformado em uma Regex.'
      })
      regexPesquisa = /.*/gi;
    }
    let resultado: Map<string, InformacaoBitrix> = new Map();
    tarefas.current.filter(infoBitrix => infoBitrix.id.match(regexPesquisa)).forEach((tarefa, idx) => resultado.set(tarefa.id, tarefa));
    tarefas.current.filter(infoBitrix => infoBitrix.titulo.match(regexPesquisa)).forEach((tarefa, idx) => resultado.set(tarefa.id, tarefa));
    setTarefasFiltradas(resultado);
  }
  
  const showBitrixDesativado = () => {
      notifications.show({
        title: 'Informação',
        color: 'blue',
        message: 'A url de integração com o Bitrix não foi definida. Para definir acesse as configurações.'
      });
  }

  const getQuantidadeArquivosPastaTarefa = (dadosTarefa: InformacaoBitrix): string => {
    const dadosPasta: FolderInfo = folders.find((folder: FolderInfo) => folder.nome.indexOf(dadosTarefa.id) !== -1);
    return String(dadosPasta.quantidadeArquivos);
  }

  const openFolder = async (numeroTarefa: string) => {
    if(numeroTarefa) {
      await ninja.fileManager.openFolder(numeroTarefa);
    } else {
      notifications.show({
        message: "Não foi encontrado o número do caso no nome do banco de dados.",
      })
    }
  }

  const dadosCasoFooterContent  = (dadosCaso?: InformacaoBitrix) => {
    return <>
      <div>
        <Tooltip label="Abrir pasta da tarefa">
          <Indicator 
            inline 
            label={getQuantidadeArquivosPastaTarefa(dadosCaso)} 
            size={16} 
            color="gray.7"
          >
            <ActionIcon 
              onClick={() => openFolder(dadosCaso.id)} 
              size="lg"
              color="blue"
              variant="filled"
            >
              <IconFolderOpen/>
            </ActionIcon>
          </Indicator>
        </Tooltip>
      </div>
    </>
  }

  return <>
    <Box mb="xs" ref={searchFieldFocusTrap}>
      <Group grow>
        <TextInput
          placeholder="Pesquise o número da tarefa ou o título" 
          value={termoDePesquisa}
          onChange={event => setTermoDePesquisa(event.currentTarget.value)} />
      </Group>
    </Box>
 
    {tarefasFiltradas && Array.from(tarefasFiltradas).map(([key, value]) => (
      <Card key={key} mb={3}>
        <DadosCaso dadosCaso={value} footerContent={dadosCasoFooterContent(value)}/>
      </Card>
    ))}
  </>;
}

export default ByFolder;

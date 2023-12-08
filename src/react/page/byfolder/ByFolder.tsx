import React, { FC, useEffect, useRef, useState } from "react";
import InformacaoBitrix from "../../../model/informacaoBitrix";
import ComentarioBitrix from "../../../model/comentarioBitrix";
import { getNumeroTarefa } from "../../../electron/utils/ninja.util";
import { notifications } from "@mantine/notifications";
import DadosCaso from "../../components/dadosCaso/DadosCaso";
import { ActionIcon, Box, Card, Group, Indicator, Modal, TextInput, Tooltip } from "@mantine/core";
import { useDebouncedValue, useDisclosure, useFocusTrap } from "@mantine/hooks";
import { IconFolderOpen, IconMessageCircle } from "@tabler/icons-react";
import { FolderInfo } from "../../../model/folderInfo";
import ComentariosView from "../dashboard/ComentariosView";
import DadosComentario from "../../components/dadosComentario/DadosComentario";

const ByFolder: FC = () => {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [ openedComments, openedCommentsHandlers ] = useDisclosure(false);
  const [ loadingComments, setLoadingComments ] = useState<boolean>(true);
  const [ modalContent, setModalContent ] = useState<any>(<></>);
  const [ tarefaSelecionada, setTarefaSelecionada ] = useState<InformacaoBitrix>(null);
  const [ comments, setComments ] = useState<ComentarioBitrix[]>([]);
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

  const findComentarios = async (informacaoBitrix: InformacaoBitrix) => {
    setLoadingComments(true);
    try {
      setComments(await ninja.bitrix.getComentariosTarefa(informacaoBitrix.id));
      openedCommentsHandlers.open();
    } catch (error) {
      ninja.main.appendLog(`Erro ao carregar comentários: ${error}`)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Não foi possível carregar os comentários.',
      });
    } finally {
      setLoadingComments(false);
    }
  }

const loadComments = async (dadosTarefa: InformacaoBitrix) => {
    try {
      await findComentarios(dadosTarefa);
      setTarefaSelecionada(dadosTarefa);
      setModalContent(<DadosComentario comments={comments} dadosTarefa={dadosTarefa}/>);
      openedCommentsHandlers.open();
    } catch (error) {
      notifications.show({
        message: `Ocorreu um erro ao obter os comentários. Detalhes: ${error}`,
      })
    }
}

  const dadosCasoFooterContent  = (dadosCaso?: InformacaoBitrix) => {
    return <>
      <Modal 
        title={tarefaSelecionada ? tarefaSelecionada.id : 'Sem número'}
        opened={openedComments}
        onClose={openedCommentsHandlers.close}
      >
        {modalContent}
      </Modal>
      <Group>
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
        <Tooltip label={'Mostrar comentários'}>
              <ActionIcon 
                onClick={() => loadComments(dadosCaso)}
                size="lg"
                color="blue"
                variant="filled"
              >
                <IconMessageCircle/>
              </ActionIcon>
            </Tooltip>
      </Group>
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
      <>
        <Card key={key} mb={3}>
          <DadosCaso dadosCaso={value} footerContent={dadosCasoFooterContent(value)} titleClick={ninja.main.openLink}/>
        </Card>
      </>
    ))}
  </>
}

export default ByFolder;

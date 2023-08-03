import { ActionIcon, Button, FileInput, Group, Space, Tabs, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDownload, IconSearch } from "@tabler/icons-react";
import React, { FC } from "react";
import { RestoreLink } from "../../model/restoreLink";
import { useDispatch } from "react-redux";
import { globalActions } from "../store/slice/global.slice";
import { RestoreArquivo } from "src/model/restoreArquivo";

const Restore: FC = () => {

  const dispatch = useDispatch();

  const form = useForm<RestoreLink>({
    initialValues: {
        nomeBanco: undefined,
        link: undefined
    },
    validate: (values) => ({
        'nomeBanco': !!!values['nomeBanco'] ? "Informe o nome do banco" : null,
        link: !!!values.link ? "Informe o link" : null,
    })
  });

  const formArquivo = useForm({
    initialValues: {
        nomeBanco: undefined,
        arquivo: undefined as any,
    },
    validate: (values) => ({
        nomeBanco: !!!values['nomeBanco'] ? "Informe o nome do banco" : null,
        arquivo: !!!values.arquivo ? "O arquivo" : null,
    })
  });

  const selecionarPasta = async (field: string, btnLabel: string) => {
    const fieldValue = Object.entries(form.values).find(it => it && it[0] === field);
    const result = await ninja.fileManager.openFileSelection(btnLabel,  fieldValue && fieldValue[1]|| '');
    if (result) {
      formArquivo.setFieldValue(field, result);
    }
  }

  const handleSubmit = (values: RestoreLink) => {
    ninja.restore.restoreDatabase(values);
    dispatch(globalActions.setLogVisible(true));
  }

  const handleSubmitArquivo = (values: RestoreArquivo) => {
    ninja.restore.restoreDatabase(values);
    dispatch(globalActions.setLogVisible(true));
  }

  return (
    <>
     <Tabs defaultValue="via-link">
      <Tabs.List>
        <Tabs.Tab value="via-link" icon={<IconDownload/>}>Via Link</Tabs.Tab>
        <Tabs.Tab value="via-arquivo" icon={<IconDownload/>}>Via Arquivo</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="via-link" pt="xs">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput size="md" placeholder="Nome do banco"
                      {...form.getInputProps('nomeBanco')}/>
          <Space h="lg"/>
          <TextInput size="md" placeholder="Link para o backup"
                      {...form.getInputProps('link')}/>
          <Space h="lg"/>
          <Button size="lg" type="submit">
              Salvar
          </Button>
        </form>
      </Tabs.Panel>
      <Tabs.Panel value="via-arquivo" pt="xs">
        <form onSubmit={formArquivo.onSubmit(handleSubmitArquivo)}>
          <TextInput size="md" placeholder="Nome do banco"
                      {...formArquivo.getInputProps('nomeBanco')}/>
          <Space h="md"/>
          <Tooltip label={formArquivo.values.arquivo || ''} disabled={!formArquivo.values.arquivo}>
            <Group mt="md" position="left">
                <TextInput disabled value={formArquivo.values.arquivo} label="Arquivo do backup (*.zip ou *.backup)"/>
                <ActionIcon variant="default" mt="xl" size="lg" onClick={() => selecionarPasta('arquivo', 'Selecione o arquivo de backup')}>
                  <IconSearch color="blue"/>
                </ActionIcon>
            </Group>
          </Tooltip>
          <Space h="lg"/>
          <Button size="lg" type="submit">
              Salvar
          </Button>
        </form>
      </Tabs.Panel>
     </Tabs>
    </>
  )

}

export default Restore;
import { useForm } from "@mantine/form";
import React, { FC, useEffect } from "react";
import { Configuracao } from "../../model/configuracao";
import { ActionIcon, Box, Button, Group, PasswordInput, TextInput, Tooltip } from "@mantine/core";
import { IconSearch } from '@tabler/icons-react'
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { notifications } from "@mantine/notifications";
import { download } from "src/electron/utils/httpsDownload";

const Config: FC = () => {

  useEffect(() => {
    setFormValuesFromConfig();
  }, [])

  const required = (value: string) => {
    return '' === value || null === value ? 'O campo não pode estar vazio' : null
  }

  const setFormValuesFromConfig = async () => {
    const config = await ninja.config.getConfiguracao();
    if (config){
      form.setFieldValue('dbUser', config.dbUser || null);
      form.setFieldValue('dbHostname', config.dbHostname || null);
      form.setFieldValue('dbPassword', config.dbPassword || null);
      form.setFieldValue('dbBackupFolder', config.dbBackupFolder || null);
      form.setFieldValue('downloadPath', config.downloadPath || null);
      form.setFieldValue('issueFolder', config.issueFolder || null);
      form.setFieldValue('dbDefaultDatabase', config.dbDefaultDatabase || null);
      form.setFieldValue('dbPrefix', config.dbPrefix || null);
      form.setFieldValue('dbPort', config.dbPort || null);
    }
  }

  const form = useForm<Configuracao>({
    initialValues: {
      dbUser: null,
      dbPassword: null,
      dbHostname: null,
      dbBackupFolder: null,
      dbDefaultDatabase: 'postgres',
      dbPrefix: '%',
      dbIgnore: 'postgres',
      dbPort: '5432',
      downloadPath: null,
      issueFolder: null,
    },
    validate: {
      dbUser: required,
      dbPassword: required,
      dbHostname: required,
      dbBackupFolder: required,
      dbDefaultDatabase: required,
      dbPort: required,
      dbPrefix: required,
      downloadPath: required,
      issueFolder: required,
    }
  });

  const formSubmit = async (values: Configuracao) => {
    ninja.config.setConfiguracao(values);
    try {
      await ninja.postgres.reconnect();
      if (ninja.postgres.hasConnection()) {
        ninja.main.setScreenState(ScreenState.HOME);
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível conectar no banco com as informações fornecidas. Detalhes: ' + error,
        color: 'red'
      })
    }
  }

  const selecionarPasta = async (field: string, btnLabel: string) => {
    const fieldValue = Object.values(form.values).find(it => it && it[0] === field);
    console.log(fieldValue && fieldValue[1] || '');
    const result = await ninja.fileManager.openFolderSelection(btnLabel,  fieldValue && fieldValue[1]|| '');
    form.setFieldValue(field, result);
  }


  return (
    <>
      <Box maw={350} mx="auto">
        <form onSubmit={form.onSubmit(formSubmit)}>
          <TextInput withAsterisk label="DB - User" {...form.getInputProps('dbUser')}/>
          <PasswordInput withAsterisk label="DB - Password" {...form.getInputProps('dbPassword')}/>
          <TextInput withAsterisk label="DB - Host" {...form.getInputProps('dbHostname')}/>
          <TextInput withAsterisk label="DB - Port" {...form.getInputProps('dbPort')}/>
          <TextInput withAsterisk label="DB - database" {...form.getInputProps('dbDefaultDatabase')}/>
          <TextInput withAsterisk label="Prefixo do nome do banco" {...form.getInputProps('dbPrefix')}/>
          <Tooltip label={form.values.dbBackupFolder || ''} disabled={!form.values.dbBackupFolder}>
            <Group mt="md" position="left">
                <TextInput disabled value={form.values.dbBackupFolder} label="Pasta de backup do container do postgres"/>
                <ActionIcon variant="default" mt="xl" size="lg" onClick={() => selecionarPasta('dbBackupFolder', 'Selecione a pasta de backup do postgres')}>
                  <IconSearch color="blue"/>
                </ActionIcon>
            </Group>
          </Tooltip>
          <Tooltip label={form.values.downloadPath || ''} disabled={!form.values.downloadPath}>
            <Group mt="md" position="left">
                <TextInput disabled value={form.values.downloadPath} label="Pasta para baixar o backup"/>
                <ActionIcon variant="default" mt="xl" size="lg" onClick={() => selecionarPasta('downloadPath', 'Selecione a pasta para salvar downloads')}>
                  <IconSearch color="blue"/>
                </ActionIcon>
            </Group>
          </Tooltip>
          <Tooltip label={form.values.issueFolder || ''} disabled={!form.values.issueFolder}>
            <Group mt="md" position="left">
                <TextInput disabled value={form.values.issueFolder} label="Pasta para salvar dados do caso"/>
                <ActionIcon variant="default" mt="xl" size="lg" onClick={() => selecionarPasta('issueFolder', 'Definir pasta para salvar dados da tarefa')}>
                  <IconSearch color="blue"/>
                </ActionIcon>
            </Group>
          </Tooltip>
          <Group position="right" mt="md">
            <Button type="submit">Salvar</Button>
          </Group>
        </form>
      </Box>
    </>
  );

};

export default Config;
import React, { FC, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { ActionIcon, Box, Button, Checkbox, Group, PasswordInput, Switch, TextInput, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch } from '@tabler/icons-react'
import { Configuracao } from "../../model/configuracao";
import { ScreenState } from "../../model/enumerated/screenState.enum";
import { requiredField } from "../../electron/utils/validation.util";

const Config: FC = () => {

  const [hasBinaries, setHasBinaries] = useState<boolean>(false);

  useEffect(() => {
    setFormValuesFromConfig();
  }, []);


  const setFormValuesFromConfig = async () => {
    const config = await ninja.config.getConfiguracao();
    setHasBinaries(await ninja.postgres.hasBinaries());
    if (config){
      const configEntries = Object.entries(config);
      configEntries.forEach(entry => form.setFieldValue(entry[0], entry[1]));
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
      dbDocker: true,
      downloadPath: null,
      issueFolder: null,
      bitrixApiURL: null,
    },
    validate: {
      dbUser: requiredField,
      dbPassword: requiredField,
      dbHostname: requiredField,
      dbBackupFolder: requiredField,
      dbDefaultDatabase: requiredField,
      dbPort: requiredField,
      dbPrefix: requiredField,
      downloadPath: requiredField,
      issueFolder: requiredField,
    }
  });

  const formSubmit = async (values: Configuracao) => {
    ninja.config.setConfiguracao(values);
    try {
      await ninja.postgres.reconnect();
      await ninja.bitrix.checkConfig();

      if (!(await ninja.config.hasReadAndWriteAccess(values.downloadPath))) {
        throw new Error(`O usuário não tem permissão de escrita e/ou leitura no caminho: ${values.downloadPath}.`);
      }
      if (!(await ninja.config.hasReadAndWriteAccess(values.dbBackupFolder))) {
        throw new Error(`O usuário não tem permissão de escrita e/ou leitura no caminho: ${values.dbBackupFolder}.`);
      }
      if (!(await ninja.config.hasReadAndWriteAccess(values.issueFolder))) {
        throw new Error(`O usuário não tem permissão de escrita e/ou leitura no caminho: ${values.issueFolder}.`);
      }
      if (ninja.postgres.hasConnection()) {
        ninja.main.setScreenState(ScreenState.DASHBOARD);
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Houve algum erro nas validações finais das informações enviadas. Detalhes: ' + error,
        color: 'red'
      })
    }
  }

  const selecionarPasta = async (field: string, btnLabel: string) => {
    const fieldValue = Object.entries(form.values).find(it => it && it[0] === field);
    const result = await ninja.fileManager.openFolderSelection(btnLabel,  fieldValue && fieldValue[1]|| '');
    if (result) {
      form.setFieldValue(field, result);
    }
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
          <Group mt="md" position="left">
            <Checkbox label="O docker está rodando em um container docker" {...form.getInputProps('dbDocker', {type: 'checkbox'})} disabled={!hasBinaries}/>
          </Group>
          <TextInput label="URL de integração com Bitrix" {...form.getInputProps('bitrixApiURL')}/>
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

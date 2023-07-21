import { Button, Container, Paper, Space, Tabs, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDownload } from "@tabler/icons-react";
import React, { FC } from "react";
import { RestoreLink } from "../../model/restoreLink";

const Restore: FC = () => {

  const form = useForm<RestoreLink>({
    initialValues: {
        'nomeBanco': undefined,
        link: undefined
    },
    validate: (values) => ({
        'nomeBanco': !!!values['nomeBanco'] ? "Informe o nome do banco" : null,
        link: !!!values.link ? "Informe o link" : null,
    })
  });

  const formArquivo = useForm({
    initialValues: {
        'nomeBanco': undefined,
        arquivo: undefined as any,
        'informarNome': true
    },
    validate: (values) => ({
        'nomeBanco': !!!values['nomeBanco'] && values['informarNome'] ? "Informe o nome do banco" : null,
        arquivo: !!!values.arquivo ? "O arquivo" : null,
    })
});

const handleSubmit = (values: RestoreLink) => {
  ninja.restore.restoreLink(values);
}

  return (
    <>
     <Tabs defaultValue="via-link">
      <Tabs.List>
        <Tabs.Tab value="via-link" icon={<IconDownload/>}>Via Link</Tabs.Tab>
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
     </Tabs>
    </>
  )

}

export default Restore;
# Manual do Usuário - Plataforma VoIP

## Introdução

Bem-vindo à Plataforma VoIP, uma solução completa para gerenciamento de comunicações por voz sobre IP. Este manual fornece instruções detalhadas sobre como utilizar todas as funcionalidades da plataforma, tanto na interface web quanto no aplicativo mobile.

## Visão Geral do Sistema

A Plataforma VoIP é composta por três componentes principais:

1. **Backend**: Responsável pelo processamento de dados, autenticação, gerenciamento de chamadas e integração com serviços externos.
2. **Frontend Web**: Interface web para administração e monitoramento da plataforma.
3. **Aplicativo Mobile**: Versão móvel para monitoramento e gerenciamento em trânsito.

## Hierarquia de Usuários

A plataforma possui dois níveis principais de acesso:

1. **Super Admin**: Administrador da plataforma com acesso total a todas as funcionalidades e contas.
2. **Admin de Cliente**: Administrador de uma conta específica, com acesso apenas aos recursos de sua conta.

## Acesso à Plataforma

### Acesso Web

1. Abra seu navegador e acesse o endereço da plataforma
2. Insira seu nome de usuário e senha
3. Clique em "Entrar"

### Acesso Mobile

1. Baixe e instale o aplicativo da Plataforma VoIP
2. Abra o aplicativo
3. Insira seu nome de usuário e senha
4. Toque em "Entrar"

## Funcionalidades Principais

### Dashboard

O Dashboard é a tela inicial após o login, apresentando uma visão geral do sistema:

- **Estatísticas Gerais**: Total de contas, ramais, troncos e chamadas
- **Gráfico de Utilização**: Visualização da utilização do sistema ao longo do tempo
- **Atividade Recente**: Últimas atividades registradas na plataforma

### Gerenciamento de Contas (Super Admin)

Como Super Admin, você pode gerenciar todas as contas da plataforma:

1. Acesse o menu "Contas" no painel lateral
2. Para criar uma nova conta:
   - Clique em "Nova Conta"
   - Preencha os dados solicitados
   - Defina os limites de ramais
   - Clique em "Salvar"
3. Para editar uma conta existente:
   - Clique no nome da conta na lista
   - Altere os dados necessários
   - Clique em "Salvar"
4. Para adicionar um administrador à conta:
   - Selecione a conta
   - Clique em "Administradores"
   - Clique em "Novo Administrador"
   - Preencha os dados do administrador
   - Clique em "Salvar"

### Gerenciamento de Ramais

#### Para Super Admin

1. Acesse o menu "Ramais" no painel lateral
2. Para criar um novo ramal:
   - Clique em "Novo Ramal"
   - Selecione a conta
   - Preencha os dados do ramal
   - Clique em "Salvar"
3. Para editar um ramal existente:
   - Clique no número do ramal na lista
   - Altere os dados necessários
   - Clique em "Salvar"

#### Para Admin de Cliente

1. Acesse o menu "Ramais" no painel lateral
2. Você verá apenas os ramais de sua conta
3. Para editar um ramal:
   - Clique no número do ramal na lista
   - Altere os dados permitidos
   - Clique em "Salvar"

### Gerenciamento de Troncos SIP

1. Acesse o menu "Troncos SIP" no painel lateral
2. Para configurar um novo tronco:
   - Clique em "Novo Tronco"
   - Preencha os dados de conexão
   - Clique em "Salvar"
3. Para testar a conexão de um tronco:
   - Selecione o tronco na lista
   - Clique em "Testar Conexão"
   - Aguarde o resultado do teste

### Monitoramento de Chamadas

1. Acesse o menu "Monitoramento" no painel lateral
2. Na seção "Chamadas Ativas":
   - Visualize todas as chamadas em andamento
   - Para escutar uma chamada, clique em "Escutar"
   - Ajuste o volume conforme necessário
   - Para encerrar a escuta, clique em "Encerrar Escuta"
3. Na seção "Histórico de Chamadas":
   - Visualize o histórico de chamadas
   - Utilize os filtros para refinar a busca
   - Clique em uma chamada para ver detalhes

### Relatórios

1. Acesse o menu "Relatórios" no painel lateral
2. Para gerar um novo relatório:
   - Clique em "Novo Relatório"
   - Selecione o tipo de relatório
   - Defina o período
   - Clique em "Gerar"
3. Para visualizar um relatório existente:
   - Selecione o relatório na lista
   - Clique em "Visualizar"
   - Para baixar, clique em "Download"

## Aplicativo Mobile

O aplicativo mobile oferece as principais funcionalidades da plataforma em um formato otimizado para dispositivos móveis:

### Dashboard Mobile

- Visualize estatísticas gerais
- Acompanhe atividades recentes
- Acesse rapidamente as principais funcionalidades

### Troncos SIP Mobile

- Visualize status dos troncos
- Teste conexões
- Receba notificações de problemas

### Chamadas Mobile

- Monitore chamadas ativas
- Escute chamadas em andamento
- Visualize histórico de chamadas

### Relatórios Mobile

- Acesse relatórios gerados
- Visualize estatísticas em formato mobile
- Aplique filtros para análise

### Perfil Mobile

- Gerencie suas informações
- Configure notificações
- Altere sua senha

## Solução de Problemas

### Problemas de Login

- Verifique se está utilizando o nome de usuário e senha corretos
- Certifique-se de que sua conta está ativa
- Se persistir, entre em contato com o Super Admin

### Problemas com Troncos SIP

- Verifique as configurações de conexão
- Execute o teste de conexão
- Confirme se o provedor SIP está operacional

### Problemas com Chamadas

- Verifique o status dos ramais envolvidos
- Confirme se o tronco SIP está ativo
- Verifique as configurações de roteamento

## Suporte

Para obter suporte adicional:

- **Email**: suporte@voipplatform.com
- **Telefone**: (XX) XXXX-XXXX
- **Horário de Atendimento**: Segunda a Sexta, das 8h às 18h

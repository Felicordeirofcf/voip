# Protótipo da Interface Web - Painel Super Admin

## Visão Geral
Este documento descreve o protótipo da interface web para o painel de Super Administrador da plataforma VoIP baseada em MeuPABX.

## Estrutura de Navegação

### Barra Lateral (Menu Principal)
- **Dashboard** - Visão geral do sistema
- **Contas** - Gerenciamento de contas de clientes
- **Administradores** - Gerenciamento de administradores
- **Ramais** - Criação e gerenciamento de ramais
- **Troncos SIP** - Configuração de troncos SIP
- **Monitoramento** - Estatísticas e escuta de chamadas
- **Relatórios** - Geração de relatórios
- **Configurações** - Configurações do sistema
- **Logs** - Registro de atividades

### Cabeçalho
- Logo da plataforma
- Nome do usuário logado
- Função (Super Admin)
- Notificações
- Botão de logout

## Telas Principais

### 1. Dashboard
```
+------------------------------------------------------+
|                                                      |
|  ESTATÍSTICAS GERAIS                                 |
|  +----------------+  +----------------+              |
|  | Total Contas   |  | Total Ramais   |              |
|  | 24             |  | 342            |              |
|  +----------------+  +----------------+              |
|                                                      |
|  +----------------+  +----------------+              |
|  | Chamadas Hoje  |  | Troncos Ativos |              |
|  | 1,245          |  | 36             |              |
|  +----------------+  +----------------+              |
|                                                      |
|  ATIVIDADE RECENTE                                   |
|  +------------------------------------------------+  |
|  | • Nova conta criada: Empresa XYZ               |  |
|  | • Novo admin adicionado: João Silva           |  |
|  | • 20 novos ramais criados para Empresa ABC    |  |
|  | • Alerta: Tronco SIP offline para Empresa DEF |  |
|  +------------------------------------------------+  |
|                                                      |
|  GRÁFICO DE UTILIZAÇÃO                               |
|  +------------------------------------------------+  |
|  |                                                |  |
|  |  [Gráfico de chamadas nas últimas 24 horas]    |  |
|  |                                                |  |
|  +------------------------------------------------+  |
|                                                      |
+------------------------------------------------------+
```

### 2. Gerenciamento de Contas
```
+------------------------------------------------------+
|                                                      |
|  GERENCIAMENTO DE CONTAS                             |
|                                                      |
|  [Botão: + Nova Conta]                               |
|                                                      |
|  Filtrar: [Campo de busca]                           |
|                                                      |
|  +------------------------------------------------+  |
|  | Nome | Status | Ramais | Admin | Data Criação  |  |
|  |------|--------|--------|-------|---------------|  |
|  | ABC  | Ativo  | 45/50  | João  | 10/05/2025    |  |
|  | XYZ  | Ativo  | 12/20  | Maria | 15/05/2025    |  |
|  | DEF  | Inativo| 0/30   | Pedro | 18/05/2025    |  |
|  +------------------------------------------------+  |
|                                                      |
|  Ações: Editar | Desativar | Ver Detalhes            |
|                                                      |
+------------------------------------------------------+
```

### 3. Formulário de Nova Conta
```
+------------------------------------------------------+
|                                                      |
|  CRIAR NOVA CONTA                                    |
|                                                      |
|  Nome da Empresa: [Campo de texto]                   |
|                                                      |
|  Descrição: [Campo de texto]                         |
|                                                      |
|  Limite de Ramais: [Campo numérico]                  |
|                                                      |
|  Status: [Dropdown: Ativo/Inativo]                   |
|                                                      |
|  DADOS DO ADMINISTRADOR                              |
|                                                      |
|  Nome: [Campo de texto]                              |
|                                                      |
|  Email: [Campo de texto]                             |
|                                                      |
|  Telefone: [Campo de texto]                          |
|                                                      |
|  Senha: [Campo de senha]                             |
|                                                      |
|  Confirmar Senha: [Campo de senha]                   |
|                                                      |
|  [Botão: Cancelar]  [Botão: Criar Conta]             |
|                                                      |
+------------------------------------------------------+
```

### 4. Gerenciamento de Ramais
```
+------------------------------------------------------+
|                                                      |
|  GERENCIAMENTO DE RAMAIS                             |
|                                                      |
|  [Botão: + Novo Ramal]                               |
|                                                      |
|  Filtrar por Conta: [Dropdown]                       |
|                                                      |
|  Buscar: [Campo de busca]                            |
|                                                      |
|  +------------------------------------------------+  |
|  | Número | Nome | Conta | Status | Data Criação  |  |
|  |--------|------|-------|--------|---------------|  |
|  | 1001   | João | ABC   | Ativo  | 10/05/2025    |  |
|  | 1002   | Maria| ABC   | Ativo  | 10/05/2025    |  |
|  | 2001   | Pedro| XYZ   | Inativo| 15/05/2025    |  |
|  +------------------------------------------------+  |
|                                                      |
|  Ações: Editar | Desativar | Configurar              |
|                                                      |
+------------------------------------------------------+
```

### 5. Configuração de Troncos SIP
```
+------------------------------------------------------+
|                                                      |
|  CONFIGURAÇÃO DE TRONCOS SIP                         |
|                                                      |
|  [Botão: + Novo Tronco]                              |
|                                                      |
|  Filtrar por Conta: [Dropdown]                       |
|                                                      |
|  +------------------------------------------------+  |
|  | Nome | Conta | Host | Status | Última Atividade|  |
|  |------|-------|------|--------|----------------|  |
|  | T1   | ABC   | sip..| Ativo  | 20/05/2025     |  |
|  | T2   | XYZ   | sip..| Ativo  | 19/05/2025     |  |
|  | T3   | DEF   | sip..| Falha  | 18/05/2025     |  |
|  +------------------------------------------------+  |
|                                                      |
|  Ações: Editar | Testar | Ver Logs                   |
|                                                      |
+------------------------------------------------------+
```

### 6. Monitoramento de Chamadas
```
+------------------------------------------------------+
|                                                      |
|  MONITORAMENTO DE CHAMADAS                           |
|                                                      |
|  Filtrar por Conta: [Dropdown]                       |
|                                                      |
|  +------------------------------------------------+  |
|  | Origem | Destino | Duração | Status | Ações    |  |
|  |--------|---------|---------|--------|----------|  |
|  | 1001   | Externo | 02:34   | Ativa  | Escutar  |  |
|  | Externo| 1002    | 01:15   | Ativa  | Escutar  |  |
|  | 2001   | 2002    | 00:45   | Ativa  | Escutar  |  |
|  +------------------------------------------------+  |
|                                                      |
|  CHAMADAS RECENTES                                   |
|  +------------------------------------------------+  |
|  | Origem | Destino | Duração | Horário | Status  |  |
|  |--------|---------|---------|---------|---------|  |
|  | 1001   | Externo | 03:22   | 14:30   | Finaliz.|  |
|  | Externo| 1002    | 01:45   | 14:15   | Finaliz.|  |
|  | 2001   | 2002    | 00:30   | 14:00   | Perdida |  |
|  +------------------------------------------------+  |
|                                                      |
+------------------------------------------------------+
```

### 7. Relatórios
```
+------------------------------------------------------+
|                                                      |
|  RELATÓRIOS                                          |
|                                                      |
|  FILTROS                                             |
|  Conta: [Dropdown]                                   |
|  Período: [Seletor de data] até [Seletor de data]    |
|  Tipo: [Dropdown: Chamadas/Uso/Performance]          |
|                                                      |
|  [Botão: Gerar Relatório]                            |
|                                                      |
|  RELATÓRIOS SALVOS                                   |
|  +------------------------------------------------+  |
|  | Nome | Tipo | Data Geração | Ações             |  |
|  |------|------|--------------|-------------------|  |
|  | R1   | Cham.| 19/05/2025   | Ver | Download    |  |
|  | R2   | Uso  | 18/05/2025   | Ver | Download    |  |
|  | R3   | Perf.| 17/05/2025   | Ver | Download    |  |
|  +------------------------------------------------+  |
|                                                      |
+------------------------------------------------------+
```

## Fluxos de Interação

### Criação de Nova Conta e Administrador
1. Super Admin acessa "Contas"
2. Clica em "+ Nova Conta"
3. Preenche dados da empresa e do administrador
4. Confirma criação
5. Sistema cria conta e envia credenciais ao administrador

### Criação de Ramais
1. Super Admin acessa "Ramais"
2. Seleciona a conta no filtro
3. Clica em "+ Novo Ramal"
4. Preenche dados do ramal
5. Confirma criação
6. Sistema cria ramal e associa à conta selecionada

### Monitoramento de Chamadas
1. Super Admin acessa "Monitoramento"
2. Visualiza chamadas ativas
3. Seleciona uma chamada
4. Clica em "Escutar"
5. Sistema inicia escuta da chamada em tempo real

## Considerações de Design
- Interface responsiva para acesso em diferentes dispositivos
- Esquema de cores profissional e intuitivo
- Ícones claros e representativos
- Feedback visual para ações importantes
- Confirmações para operações críticas
- Notificações para eventos importantes

# Protótipo da Interface Mobile - Aplicativo VoIP

## Visão Geral
Este documento descreve o protótipo da interface mobile para o aplicativo da plataforma VoIP baseada em MeuPABX, com foco nas funcionalidades para administradores de cliente e monitoramento.

## Estrutura de Navegação

### Menu Inferior
- **Dashboard** - Visão geral e estatísticas
- **Troncos** - Gerenciamento de troncos SIP
- **Chamadas** - Monitoramento de chamadas
- **Relatórios** - Visualização de relatórios
- **Perfil** - Configurações de conta

## Telas Principais

### 1. Login
```
+---------------------------+
|                           |
|      [Logo Plataforma]    |
|                           |
|  +---------------------+  |
|  | Email               |  |
|  +---------------------+  |
|                           |
|  +---------------------+  |
|  | Senha               |  |
|  +---------------------+  |
|                           |
|  [Botão: Entrar]          |
|                           |
|  Esqueceu sua senha?      |
|                           |
+---------------------------+
```

### 2. Dashboard
```
+---------------------------+
| Olá, [Nome]               |
| [Conta: Nome da Empresa]  |
|                           |
| RESUMO                    |
| +---------------------+   |
| | Ramais Ativos: 24   |   |
| +---------------------+   |
|                           |
| +---------------------+   |
| | Chamadas Hoje: 156  |   |
| +---------------------+   |
|                           |
| +---------------------+   |
| | Troncos Ativos: 3   |   |
| +---------------------+   |
|                           |
| ATIVIDADE RECENTE         |
| • Chamada: 1001 → Externo |
| • Tronco SIP1 atualizado  |
| • Novo relatório gerado   |
|                           |
| [Gráfico: Uso diário]     |
|                           |
+---------------------------+
```

### 3. Gerenciamento de Troncos SIP
```
+---------------------------+
| TRONCOS SIP               |
|                           |
| [Botão: + Configurar]     |
|                           |
| +---------------------+   |
| | Tronco 1            |   |
| | Status: Ativo       |   |
| | [Botão: Detalhes]   |   |
| +---------------------+   |
|                           |
| +---------------------+   |
| | Tronco 2            |   |
| | Status: Inativo     |   |
| | [Botão: Detalhes]   |   |
| +---------------------+   |
|                           |
+---------------------------+
```

### 4. Detalhes do Tronco SIP
```
+---------------------------+
| DETALHES DO TRONCO        |
|                           |
| Nome: Tronco 1            |
|                           |
| Status: Ativo             |
|                           |
| Host: sip.provedor.com    |
|                           |
| Usuário: user123          |
|                           |
| [Botão: Editar]           |
|                           |
| ESTATÍSTICAS              |
| • Chamadas hoje: 45       |
| • Tempo médio: 2:30       |
| • Qualidade: 98%          |
|                           |
| [Botão: Testar Conexão]   |
|                           |
+---------------------------+
```

### 5. Configuração de Tronco SIP
```
+---------------------------+
| CONFIGURAR TRONCO         |
|                           |
| Nome:                     |
| [Campo de texto]          |
|                           |
| Host:                     |
| [Campo de texto]          |
|                           |
| Usuário:                  |
| [Campo de texto]          |
|                           |
| Senha:                    |
| [Campo de senha]          |
|                           |
| Tipo de Autenticação:     |
| [Dropdown]                |
|                           |
| [Botão: Cancelar]         |
| [Botão: Salvar]           |
|                           |
+---------------------------+
```

### 6. Monitoramento de Chamadas
```
+---------------------------+
| CHAMADAS ATIVAS           |
|                           |
| +---------------------+   |
| | Ramal 1001 → Externo|   |
| | Duração: 02:34      |   |
| | [Botão: Escutar]    |   |
| +---------------------+   |
|                           |
| +---------------------+   |
| | Externo → Ramal 1002|   |
| | Duração: 01:15      |   |
| | [Botão: Escutar]    |   |
| +---------------------+   |
|                           |
| HISTÓRICO DE CHAMADAS     |
| [Botão: Ver Completo]     |
|                           |
+---------------------------+
```

### 7. Escuta de Chamada
```
+---------------------------+
| ESCUTA DE CHAMADA         |
|                           |
| Origem: Ramal 1001        |
| Destino: Externo          |
|                           |
| Duração: 02:34            |
|                           |
| [Indicador de áudio ativo]|
|                           |
| Volume:                   |
| [Controle deslizante]     |
|                           |
| [Botão: Encerrar Escuta]  |
|                           |
| Nota: Esta chamada está   |
| sendo monitorada apenas   |
| para fins de qualidade.   |
|                           |
+---------------------------+
```

### 8. Relatórios
```
+---------------------------+
| RELATÓRIOS                |
|                           |
| FILTROS                   |
| Período:                  |
| [Seletor de data]         |
|                           |
| Tipo:                     |
| [Dropdown]                |
|                           |
| [Botão: Aplicar]          |
|                           |
| RELATÓRIOS DISPONÍVEIS    |
| +---------------------+   |
| | Uso Diário          |   |
| | 20/05/2025          |   |
| | [Botão: Visualizar] |   |
| +---------------------+   |
|                           |
| +---------------------+   |
| | Chamadas por Ramal  |   |
| | 19/05/2025          |   |
| | [Botão: Visualizar] |   |
| +---------------------+   |
|                           |
+---------------------------+
```

### 9. Visualização de Relatório
```
+---------------------------+
| RELATÓRIO: USO DIÁRIO     |
|                           |
| Período: 20/05/2025       |
|                           |
| [Gráfico de barras]       |
|                           |
| RESUMO                    |
| • Total chamadas: 156     |
| • Duração média: 2:15     |
| • Pico: 14:00-15:00       |
|                           |
| DETALHES POR RAMAL        |
| • Ramal 1001: 45 chamadas |
| • Ramal 1002: 32 chamadas |
| • Ramal 1003: 28 chamadas |
|                           |
| [Botão: Compartilhar]     |
| [Botão: Download PDF]     |
|                           |
+---------------------------+
```

### 10. Perfil e Configurações
```
+---------------------------+
| PERFIL                    |
|                           |
| [Foto/Avatar]             |
|                           |
| Nome: João Silva          |
| Email: joao@empresa.com   |
| Função: Admin             |
|                           |
| [Botão: Editar Perfil]    |
|                           |
| CONFIGURAÇÕES             |
|                           |
| Notificações:             |
| [Toggle: ON/OFF]          |
|                           |
| Tema Escuro:              |
| [Toggle: ON/OFF]          |
|                           |
| [Botão: Alterar Senha]    |
|                           |
| [Botão: Sair]             |
|                           |
+---------------------------+
```

## Fluxos de Interação

### Configuração de Tronco SIP
1. Usuário acessa a seção "Troncos"
2. Toca em "+ Configurar"
3. Preenche os dados do tronco SIP
4. Toca em "Salvar"
5. Sistema valida e salva as configurações
6. Retorna à lista de troncos com o novo tronco adicionado

### Monitoramento de Chamadas
1. Usuário acessa a seção "Chamadas"
2. Visualiza lista de chamadas ativas
3. Toca em "Escutar" em uma chamada específica
4. Sistema inicia a escuta da chamada
5. Usuário ajusta volume se necessário
6. Toca em "Encerrar Escuta" para finalizar

### Visualização de Relatórios
1. Usuário acessa a seção "Relatórios"
2. Define filtros de período e tipo
3. Toca em "Aplicar"
4. Seleciona um relatório da lista
5. Visualiza gráficos e dados detalhados
6. Pode compartilhar ou baixar o relatório

## Considerações de Design Mobile
- Interface adaptada para telas pequenas e touch
- Botões grandes e fáceis de tocar
- Navegação simplificada com menu inferior
- Suporte a gestos (deslizar, pinçar para zoom)
- Modo escuro para uso noturno
- Notificações push para eventos importantes
- Design responsivo para diferentes tamanhos de tela
- Otimização para uso com uma mão
- Feedback tátil para ações importantes

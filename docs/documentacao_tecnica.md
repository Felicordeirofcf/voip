# Documentação Técnica - Plataforma VoIP

## Arquitetura do Sistema

A Plataforma VoIP foi desenvolvida com uma arquitetura moderna e escalável, composta por três componentes principais:

### 1. Backend (Django/Django REST Framework)

O backend é construído com Django e Django REST Framework, fornecendo uma API RESTful para comunicação com os clientes frontend e mobile. A estrutura do backend é organizada em aplicativos Django, cada um responsável por um domínio específico:

- **accounts**: Gerenciamento de contas, usuários e permissões
- **extensions**: Gerenciamento de ramais
- **trunks**: Gerenciamento de troncos SIP
- **monitoring**: Monitoramento de chamadas e geração de relatórios
- **api**: Endpoints centrais e configurações da API

### 2. Frontend Web (React)

O frontend web é desenvolvido com React e Material-UI, oferecendo uma interface responsiva e moderna para administração e monitoramento da plataforma. A estrutura do frontend é organizada em componentes reutilizáveis e contextos para gerenciamento de estado.

### 3. Aplicativo Mobile (React Native)

O aplicativo mobile é desenvolvido com React Native, permitindo o monitoramento e gerenciamento da plataforma em dispositivos móveis. A estrutura do aplicativo segue padrões semelhantes ao frontend web, com adaptações para a experiência móvel.

## Diagrama de Arquitetura

```
+------------------+      +------------------+      +------------------+
|                  |      |                  |      |                  |
|  Frontend Web    |      |  Aplicativo      |      |  Serviços        |
|  (React)         |<---->|  Mobile          |<---->|  Externos        |
|                  |      |  (React Native)  |      |  (SIP, etc.)     |
+------------------+      +------------------+      +------------------+
          ^                        ^                         ^
          |                        |                         |
          v                        v                         v
+------------------------------------------------------------------+
|                                                                  |
|                      API REST (Django)                           |
|                                                                  |
+------------------------------------------------------------------+
          ^                        ^                         ^
          |                        |                         |
          v                        v                         v
+------------------+      +------------------+      +------------------+
|                  |      |                  |      |                  |
|  Banco de Dados  |      |  Cache           |      |  Armazenamento   |
|  (PostgreSQL)    |      |  (Redis)         |      |  (S3/Local)      |
|                  |      |                  |      |                  |
+------------------+      +------------------+      +------------------+
```

## Estrutura do Projeto

### Backend

```
backend/
├── accounts/           # Gerenciamento de contas e usuários
│   ├── models.py       # Modelos de dados
│   ├── serializers.py  # Serializadores para API
│   ├── views.py        # Views da API
│   ├── permissions.py  # Permissões personalizadas
│   └── urls.py         # Rotas da API
├── extensions/         # Gerenciamento de ramais
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── trunks/             # Gerenciamento de troncos SIP
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── monitoring/         # Monitoramento e relatórios
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── api/                # Configurações centrais da API
│   ├── urls.py
│   └── views.py
└── voip_core/          # Configurações do projeto Django
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

### Frontend Web

```
frontend/
├── components/         # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── layout/         # Componentes de layout
│   ├── dashboard/      # Componentes do dashboard
│   ├── accounts/       # Componentes de gerenciamento de contas
│   ├── extensions/     # Componentes de gerenciamento de ramais
│   ├── trunks/         # Componentes de gerenciamento de troncos
│   ├── monitoring/     # Componentes de monitoramento
│   └── reports/        # Componentes de relatórios
├── contexts/           # Contextos React para gerenciamento de estado
│   └── AuthContext.js  # Contexto de autenticação
└── App.js              # Componente principal
```

### Aplicativo Mobile

```
mobile/
├── screens/            # Telas do aplicativo
│   ├── auth/           # Telas de autenticação
│   ├── DashboardScreen.js
│   ├── TrunksScreen.js
│   ├── CallsScreen.js
│   ├── ReportsScreen.js
│   └── ProfileScreen.js
├── contexts/           # Contextos React para gerenciamento de estado
│   └── AuthContext.js  # Contexto de autenticação
└── App.js              # Componente principal
```

## API REST

A API REST da plataforma segue os princípios RESTful e utiliza JWT (JSON Web Tokens) para autenticação. Abaixo estão os principais endpoints da API:

### Autenticação

- `POST /api/token/`: Obter token JWT
- `POST /api/token/refresh/`: Atualizar token JWT

### Contas e Usuários

- `GET /api/accounts/`: Listar contas (Super Admin)
- `POST /api/accounts/`: Criar nova conta (Super Admin)
- `GET /api/accounts/{id}/`: Obter detalhes de uma conta
- `PUT /api/accounts/{id}/`: Atualizar conta
- `DELETE /api/accounts/{id}/`: Excluir conta (Super Admin)
- `GET /api/accounts/users/`: Listar usuários
- `POST /api/accounts/users/`: Criar novo usuário
- `GET /api/accounts/users/{id}/`: Obter detalhes de um usuário
- `PUT /api/accounts/users/{id}/`: Atualizar usuário
- `DELETE /api/accounts/users/{id}/`: Excluir usuário
- `GET /api/accounts/users/me/`: Obter dados do usuário atual

### Ramais

- `GET /api/extensions/`: Listar ramais
- `POST /api/extensions/`: Criar novo ramal (Super Admin)
- `GET /api/extensions/{id}/`: Obter detalhes de um ramal
- `PUT /api/extensions/{id}/`: Atualizar ramal
- `DELETE /api/extensions/{id}/`: Excluir ramal (Super Admin)

### Troncos SIP

- `GET /api/trunks/`: Listar troncos SIP
- `POST /api/trunks/`: Criar novo tronco SIP
- `GET /api/trunks/{id}/`: Obter detalhes de um tronco SIP
- `PUT /api/trunks/{id}/`: Atualizar tronco SIP
- `DELETE /api/trunks/{id}/`: Excluir tronco SIP
- `POST /api/trunks/{id}/test/`: Testar conexão do tronco SIP

### Monitoramento

- `GET /api/monitoring/calls/`: Listar chamadas
- `GET /api/monitoring/calls/active/`: Listar chamadas ativas
- `GET /api/monitoring/calls/statistics/`: Obter estatísticas de chamadas
- `POST /api/monitoring/start/{call_id}/`: Iniciar monitoramento de chamada
- `POST /api/monitoring/stop/{monitoring_id}/`: Encerrar monitoramento de chamada
- `GET /api/monitoring/reports/`: Listar relatórios
- `POST /api/monitoring/generate-report/`: Gerar novo relatório

## Modelos de Dados

### Account (Conta)

```python
class Account(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    max_extensions = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### UserProfile (Perfil de Usuário)

```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_super_admin = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### AccountMembership (Associação Usuário-Conta)

```python
class AccountMembership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='account_memberships')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('user', 'User')])
    created_at = models.DateTimeField(auto_now_add=True)
```

### Extension (Ramal)

```python
class Extension(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='extensions')
    extension_number = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### SIPTrunk (Tronco SIP)

```python
class SIPTrunk(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='trunks')
    name = models.CharField(max_length=100)
    host = models.CharField(max_length=100)
    port = models.IntegerField(default=5060)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Call (Chamada)

```python
class Call(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='calls')
    call_id = models.CharField(max_length=100, unique=True)
    extension = models.ForeignKey(Extension, on_delete=models.SET_NULL, null=True, blank=True, related_name='calls')
    trunk = models.ForeignKey(SIPTrunk, on_delete=models.SET_NULL, null=True, blank=True, related_name='calls')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    call_direction = models.CharField(max_length=10, choices=[('inbound', 'Entrada'), ('outbound', 'Saída'), ('internal', 'Interna')])
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[('active', 'Ativa'), ('completed', 'Finalizada'), ('missed', 'Perdida'), ('failed', 'Falha')])
    quality_metrics = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## Sistema de Permissões

A plataforma implementa um sistema de permissões baseado em papéis:

### Super Admin

- Acesso total a todas as funcionalidades
- Pode criar e gerenciar contas
- Pode criar e gerenciar ramais para qualquer conta
- Pode visualizar todas as chamadas e relatórios

### Admin de Cliente

- Acesso apenas aos recursos de sua conta
- Pode gerenciar usuários de sua conta
- Pode configurar troncos SIP
- Pode monitorar chamadas de sua conta
- Pode gerar relatórios para sua conta

## Fluxos Principais

### Fluxo de Autenticação

1. O usuário acessa a tela de login
2. Insere suas credenciais
3. O frontend envia uma requisição para `/api/token/`
4. O backend valida as credenciais e retorna os tokens JWT (access e refresh)
5. O frontend armazena os tokens e redireciona para o dashboard
6. Quando o token de acesso expira, o frontend utiliza o token de atualização para obter um novo token de acesso via `/api/token/refresh/`

### Fluxo de Monitoramento de Chamadas

1. O usuário acessa a tela de monitoramento
2. O frontend solicita as chamadas ativas via `/api/monitoring/calls/active/`
3. O backend retorna a lista de chamadas ativas
4. O usuário seleciona uma chamada para monitorar
5. O frontend envia uma requisição para `/api/monitoring/start/{call_id}/`
6. O backend inicia o monitoramento e retorna os detalhes da sessão
7. O frontend exibe a interface de monitoramento
8. Quando o usuário encerra o monitoramento, o frontend envia uma requisição para `/api/monitoring/stop/{monitoring_id}/`

## Requisitos de Implantação

### Backend

- Python 3.8+
- Django 3.2+
- Django REST Framework 3.12+
- PostgreSQL 12+
- Redis (opcional, para cache)

### Frontend Web

- Node.js 14+
- React 17+
- Material-UI 5+

### Aplicativo Mobile

- React Native 0.64+
- Expo 44+ (opcional)

## Instruções de Implantação

### Backend

1. Clone o repositório
2. Crie um ambiente virtual: `python -m venv venv`
3. Ative o ambiente virtual: `source venv/bin/activate` (Linux/Mac) ou `venv\Scripts\activate` (Windows)
4. Instale as dependências: `pip install -r requirements.txt`
5. Configure o banco de dados em `voip_core/settings.py`
6. Execute as migrações: `python manage.py migrate`
7. Crie um superusuário: `python manage.py createsuperuser`
8. Inicie o servidor: `python manage.py runserver`

### Frontend Web

1. Navegue até a pasta do frontend: `cd frontend`
2. Instale as dependências: `npm install`
3. Configure a URL da API em `.env`
4. Inicie o servidor de desenvolvimento: `npm start`
5. Para produção, construa o aplicativo: `npm run build`

### Aplicativo Mobile

1. Navegue até a pasta do mobile: `cd mobile`
2. Instale as dependências: `npm install`
3. Configure a URL da API em `.env`
4. Inicie o servidor de desenvolvimento: `npm start`
5. Para produção, construa o aplicativo: `npm run build`

## Considerações de Segurança

- Todas as senhas são armazenadas com hash
- A comunicação com a API é protegida por HTTPS
- A autenticação é baseada em JWT com tokens de curta duração
- As permissões são verificadas em cada requisição
- Os dados sensíveis são mascarados nos logs

## Monitoramento e Manutenção

- Utilize ferramentas de monitoramento como Sentry para rastrear erros
- Configure alertas para falhas de conexão com troncos SIP
- Realize backups regulares do banco de dados
- Mantenha as dependências atualizadas para evitar vulnerabilidades de segurança

## Extensibilidade

A plataforma foi projetada para ser facilmente extensível:

- Novos tipos de relatórios podem ser adicionados implementando novos serializadores e views
- Integrações com outros sistemas podem ser implementadas através de novos endpoints da API
- Funcionalidades adicionais podem ser adicionadas criando novos aplicativos Django e componentes React

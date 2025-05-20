# Guia de Deploy - Plataforma VoIP

Este guia fornece instruções detalhadas para implantar a Plataforma VoIP em um ambiente de produção.

## Requisitos de Sistema

### Backend
- Python 3.8+
- PostgreSQL 12+
- Redis (opcional, para cache)
- Servidor web (Nginx ou Apache)
- Servidor de aplicação WSGI (Gunicorn ou uWSGI)

### Frontend
- Node.js 14+
- Servidor web (Nginx ou Apache)

### Mobile
- React Native CLI ou Expo CLI
- Android Studio (para build Android)
- Xcode (para build iOS, apenas em macOS)

## 1. Deploy do Backend

### 1.1. Preparação do Ambiente

```bash
# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
cd /caminho/para/backend
pip install -r requirements.txt

# Instalar Gunicorn
pip install gunicorn
```

### 1.2. Configuração do Banco de Dados

```bash
# Criar banco de dados PostgreSQL
sudo -u postgres psql
CREATE DATABASE voip_platform;
CREATE USER voip_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE voip_platform TO voip_user;
\q

# Configurar banco de dados no Django
# Editar voip_core/settings.py
```

Exemplo de configuração em `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'voip_platform',
        'USER': 'voip_user',
        'PASSWORD': 'senha_segura',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 1.3. Migrações e Dados Iniciais

```bash
# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic
```

### 1.4. Configuração do Gunicorn

Criar arquivo `gunicorn_config.py`:

```python
bind = "0.0.0.0:8000"
workers = 3
timeout = 120
```

### 1.5. Configuração do Nginx

Criar arquivo `/etc/nginx/sites-available/voip_platform`:

```nginx
server {
    listen 80;
    server_name seu_dominio.com;

    location /static/ {
        alias /caminho/para/backend/static/;
    }

    location /media/ {
        alias /caminho/para/backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/voip_platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 1.6. Configuração do Serviço Systemd

Criar arquivo `/etc/systemd/system/voip_platform.service`:

```ini
[Unit]
Description=Gunicorn daemon for VoIP Platform
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/caminho/para/backend
ExecStart=/caminho/para/venv/bin/gunicorn -c gunicorn_config.py voip_core.wsgi:application
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Iniciar o serviço:

```bash
sudo systemctl enable voip_platform
sudo systemctl start voip_platform
```

## 2. Deploy do Frontend

### 2.1. Preparação do Ambiente

```bash
# Instalar dependências
cd /caminho/para/frontend
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env
```

Exemplo de arquivo `.env`:

```
REACT_APP_API_URL=https://api.seu_dominio.com
```

### 2.2. Build de Produção

```bash
# Gerar build de produção
npm run build
```

### 2.3. Configuração do Nginx

Criar arquivo `/etc/nginx/sites-available/voip_platform_frontend`:

```nginx
server {
    listen 80;
    server_name app.seu_dominio.com;
    root /caminho/para/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/voip_platform_frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 3. Deploy do Aplicativo Mobile

### 3.1. Preparação do Ambiente

```bash
# Instalar dependências
cd /caminho/para/mobile
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env
```

Exemplo de arquivo `.env`:

```
API_URL=https://api.seu_dominio.com
```

### 3.2. Build para Android

```bash
# Gerar APK de release
cd android
./gradlew assembleRelease
```

O APK será gerado em `android/app/build/outputs/apk/release/app-release.apk`.

### 3.3. Build para iOS (apenas em macOS)

```bash
# Abrir projeto no Xcode
cd ios
pod install
open voip_platform.xcworkspace
```

No Xcode:
1. Selecionar "Product" > "Archive"
2. Seguir as instruções para distribuição

## 4. Configuração de HTTPS

### 4.1. Instalação do Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 4.2. Obtenção de Certificados

```bash
sudo certbot --nginx -d api.seu_dominio.com -d app.seu_dominio.com
```

## 5. Monitoramento e Manutenção

### 5.1. Configuração de Logs

```bash
# Verificar logs do backend
sudo journalctl -u voip_platform

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

### 5.2. Backup do Banco de Dados

```bash
# Backup diário
pg_dump -U voip_user voip_platform > backup_$(date +%Y%m%d).sql
```

### 5.3. Atualização do Sistema

```bash
# Atualizar backend
cd /caminho/para/backend
git pull
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
sudo systemctl restart voip_platform

# Atualizar frontend
cd /caminho/para/frontend
git pull
npm install
npm run build
```

## 6. Deploy Rápido com Docker (Alternativa)

### 6.1. Instalação do Docker e Docker Compose

```bash
# Instalar Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Iniciar Docker
sudo systemctl enable docker
sudo systemctl start docker
```

### 6.2. Configuração do Docker Compose

Criar arquivo `docker-compose.yml`:

```yaml
version: '3'

services:
  db:
    image: postgres:12
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env
    environment:
      - POSTGRES_PASSWORD=senha_segura
      - POSTGRES_USER=voip_user
      - POSTGRES_DB=voip_platform

  backend:
    build: ./backend
    restart: always
    depends_on:
      - db
    env_file:
      - ./.env
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    command: gunicorn voip_core.wsgi:application --bind 0.0.0.0:8000

  frontend:
    build: ./frontend
    restart: always
    volumes:
      - frontend_build:/app/build

  nginx:
    image: nginx:1.19
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - static_volume:/static
      - media_volume:/media
      - frontend_build:/var/www/html
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  static_volume:
  media_volume:
  frontend_build:
```

### 6.3. Iniciar os Serviços

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

## Conclusão

Seguindo este guia, você terá a Plataforma VoIP completamente implantada em um ambiente de produção. Para qualquer dúvida ou problema durante o processo de implantação, consulte a documentação técnica ou entre em contato com o suporte.

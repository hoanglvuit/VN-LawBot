# Vietnam Criminal Law Chatbot

Chatbot hỏi đáp về luật hình sự tại Việt Nam sử dụng RAG (Retrieval-Augmented Generation) model.

## 🚀 Demo

![Demo](demo/demo.png)


- **Frontend**: [https://vn-law-bot-hoanglvuits-projects.vercel.app](https://vn-law-bot-hoanglvuits-projects.vercel.app)
- **Backend API**: [https://vnlawbot.hoanglvuit.id.vn](https://vnlawbot.hoanglvuit.id.vn)

## 🏗️ Kiến trúc hệ thống

### RAG Model (AI Core)
- **Framework**: LangChain
- **Tài liệu**: Bộ luật hình sự Việt Nam 2015
- **Embedding Model**: gemini-embedding-exp-03-07
- **LLM Model**: gemini-2.0-flash. Lưu ý cần set lại rate limit & quota cho api_key. 

### Technology Stack
- **Backend**: FastAPI
- **Frontend**: Tailwind CSS + Vite

## 🌐 Deployment Journey

### Frontend Deployment
- **Platform**: Vercel (Free tier)
- **URL**: https://vn-law-bot-hoanglvuits-projects.vercel.app

### Backend Deployment Evolution

#### 1. Railway (Initial Attempt)
- **Platform**: Railway free-tier
- **Issue**: Auto sleep - service không hoạt động liên tục

#### 2. VPS Solution
- **Platform**: VPS với Docker
- **Public IP**: 31.97.51.25
- **Port Mapping**: 2824:8000 (2824 là cổng VPS nhận request, 8000 là cổng container)
- **Access**: http://31.97.51.25:2824

### 🚨 Mixed Content Problem & Solution

#### Vấn đề phát sinh:
- Frontend được deploy trên Vercel tạo ra HTTPS URL: `https://vn-law-bot-hoanglvuits-projects.vercel.app`
- Backend chỉ có HTTP: `http://31.97.51.25:2824`
- **Mixed Content Error**: Frontend HTTPS không thể fetch data từ backend HTTP

#### Giải pháp thực hiện:

**Bước 1: Mua domain**
- Domain: `hoanglvuit.id.vn` (miễn phí)

**Bước 2: Cấu hình subdomain**
- Tạo DNS record: `vnlawbot.hoanglvuit.id.vn` → `31.97.51.25`

**Bước 3: SSL Setup với Nginx**
- Sử dụng Nginx làm reverse proxy
- Cung cấp chứng chỉ SSL cho domain `vnlawbot.hoanglvuit.id.vn`
- Enable HTTPS access

**Kết quả:**
- Backend có thể truy cập qua HTTPS: `https://vnlawbot.hoanglvuit.id.vn`
- Frontend có thể fetch data thành công

**Lưu ý phải cấu hình CORSMiddleware trong FastAPI cho phép domain Vercel**

## 🚀 CI/CD với Jenkins

### Tại sao chọn Jenkins?

- Tự động quy trình deploy 
- Nhưng không muốn mỗi lần push code là auto deploy -> không dùng GitHub webhook, chỉ deploy khi cần thiết bằng cách nhấn "Build Now"

### Jenkins Setup Process

#### 1. Local Jenkins Container
```bash
# Chạy Jenkins container với Docker daemon mount
# Port: localhost:8080
```

#### 2. Jenkins Configuration
- **Plugins**: Cài đặt các plugin cần thiết
- **Credentials Setup**:
  - `docker-hub`: Push image lên Docker Hub
  - `vps-hoanglv`: SSH key để đăng nhập VPS
  - `langsmith-api-key`: API key cho LangSmith
  - `gemini-api-key`: API key cho Gemini

#### 3. Automated Pipeline
**Jenkinsfile thực hiện:**
1. Clone repo từ GitHub
2. CD vào backend directory
3. Build Docker image
4. Push image lên Docker Hub
5. SSH vào VPS
6. Pull image mới
7. Run container mới

**Workflow:**
```
Manual "Build Now" → Jenkins đọc Jenkinsfile → 
Clone repo → Build & Push Image → Deploy to VPS
```

## 🎯 Key Learnings

### Problem Solving Process
1. **Railway Limitation**: Free tier auto sleep → Chuyển sang VPS
2. **Mixed Content Issue**: HTTP/HTTPS conflict → Domain + SSL solution
3. **Manual Deployment**: Tốn thời gian → Jenkins automation

### Deployment Strategy
- **Frontend**: Static deployment trên Vercel (free, reliable)
- **Backend**: VPS với Docker (full control, always-on)
- **Domain**: Free domain với SSL certificate
- **CI/CD**: Jenkins cho controlled deployment

## 🛠️ Technical Architecture

```
User → Frontend (Vercel HTTPS) → Backend (VPS + Nginx SSL) → 
RAG Model (LangChain + Gemini) → Vietnam Criminal Law Database
```

# 🧩 VN-LawBot Backend Deployment Guide (EC2 + Docker + Nginx + SSL)

**Cập nhật:** 17-10-2025  

---

## 1️⃣ Khởi tạo EC2 instance

- **Loại máy:** `t2.micro` (free tier)
- **OS:** Ubuntu 22.04 (hoặc mới hơn)
- **Key Pair:** tạo `lawbot.pem` để SSH
- **Security Group:** mở inbound rules:
  - TCP `80` (HTTP)
  - TCP `443` (HTTPS)
  - TCP `2824` (Backend service)

---

## 2️⃣ Cài Docker và Git

SSH vào máy:

```bash
ssh -i lawbot.pem ubuntu@<EC2_PUBLIC_IP>
```

Cài Docker:

```bash
sudo apt update -y
sudo apt install docker.io git -y
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 3️⃣ Clone source & Build backend (FastAPI)

```bash
git clone https://github.com/hoanglvuit/VN-LawBot.git
cd ~/VN-LawBot/backend
```

Build image:

```bash
docker build -t hoanglvuitm/vnlawbot:latest .
```

Chạy backend container (kèm ENV key):

```bash
docker run -d \
  -p 2824:8000 \
  --name vnlawbot \
  -e LANGSMITH_API_KEY="lsv2_..." \
  -e GEMINI_API_KEY="AIza..." \
  hoanglvuitm/vnlawbot:latest
```

Kiểm tra log:

```bash
docker logs -f vnlawbot
```

Nếu thấy:

```
Uvicorn running on http://0.0.0.0:8000
```

→ Backend đã chạy thành công ✅

---

## 4️⃣ Cấp chứng chỉ SSL (chỉ cần làm 1 lần)

Trỏ subdomain `vnlawbot.hoanglvuit.id.vn` về IP public của EC2.

Kiểm tra DNS qua [dnschecker.org](https://dnschecker.org).

Sau đó:

```bash
cd ~
mkdir -p certbot
docker run -it --rm \
  -v $(pwd)/certbot:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d vnlawbot.hoanglvuit.id.vn
```

Khi thấy:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/vnlawbot.hoanglvuit.id.vn/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/vnlawbot.hoanglvuit.id.vn/privkey.pem
```

→ SSL ok 🎉

---

## 5️⃣ Cấu hình Nginx Reverse Proxy

Tạo thư mục:

```bash
mkdir -p ~/nginx/conf.d
cd ~/nginx
```

### 🔧 File: `~/nginx/conf.d/default.conf`

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name vnlawbot.hoanglvuit.id.vn;
    return 301 https://$host$request_uri;
}

# HTTPS Config
server {
    listen 443 ssl;
    server_name vnlawbot.hoanglvuit.id.vn;

    ssl_certificate /etc/letsencrypt/live/vnlawbot.hoanglvuit.id.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vnlawbot.hoanglvuit.id.vn/privkey.pem;

    location / {
        proxy_pass http://vnlawbot:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 6️⃣ Sử dụng docker-compose để quản lý toàn bộ

### 🧱 File: `~/nginx/docker-compose.yml`

```yaml
version: '3.8'

services:
  vnlawbot:
    image: hoanglvuitm/vnlawbot:latest
    container_name: vnlawbot
    ports:
      - "2824:8000"
    environment:
      - LANGSMITH_API_KEY=lsv2_...
      - GEMINI_API_KEY=AIza...
    restart: always

  nginx_proxy:
    image: nginx:latest
    container_name: nginx_proxy
    depends_on:
      - vnlawbot
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./conf.d:/etc/nginx/conf.d
      - /home/ubuntu/certbot:/etc/letsencrypt
    restart: always
```

Chạy tất cả:

```bash
cd ~/nginx
sudo docker compose up -d
```

---

## 7️⃣ Kiểm tra

Truy cập:

👉 **https://vnlawbot.hoanglvuit.id.vn**

Nếu phản hồi `200 OK` → thành công ✅

Kiểm tra container:

```bash
docker ps
```

Kết quả mong muốn:

```
nginx_proxy   nginx:latest
vnlawbot      hoanglvuitm/vnlawbot:latest
```

---




*Dự án được phát triển nhằm mục đích học tập và hỗ trợ tra cứu luật hình sự Việt Nam.*
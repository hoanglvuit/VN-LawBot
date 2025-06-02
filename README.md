# Vietnam Criminal Law Chatbot

Chatbot hỏi đáp về luật hình sự tại Việt Nam sử dụng RAG (Retrieval-Augmented Generation) model.

## 🚀 Demo

- **Frontend**: [https://vn-law-bot-hoanglvuits-projects.vercel.app](https://vn-law-bot-hoanglvuits-projects.vercel.app)
- **Backend API**: [https://vnlawbot.hoanglvuit.id.vn](https://vnlawbot.hoanglvuit.id.vn)

## 🏗️ Kiến trúc hệ thống

### RAG Model (AI Core)
- **Framework**: LangChain
- **Tài liệu**: Bộ luật hình sự Việt Nam 2015
- **Embedding Model**: gemini-embedding-exp-03-07
- **LLM Model**: gemini-2.0-flash

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

## 📚 Vì đang là sinh viên nên tôi nghĩ không cần học Jenkins quá nhiều

**Chỉ cần** 
Deploy tuần tự các bước thành công 
Mô tả quá trình đó cho ChatGPT để hướng dẫn tạo guide để thực hiện CI/CD bằng Jenkins

*Dự án được phát triển nhằm mục đích học tập và hỗ trợ tra cứu luật hình sự Việt Nam.*
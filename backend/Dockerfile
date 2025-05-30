# Sử dụng image chính thức của Python
FROM python:3.11-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file requirements và cài đặt thư viện
COPY requirements.txt .

# Cài đặt các thư viện từ requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy các thư mục mã nguồn vào container (không bao gồm .env)
COPY app ./app
COPY vector_store ./vector_store

# Expose port (thường dùng 8000 cho FastAPI)
EXPOSE 8000

# Chạy FastAPI với Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


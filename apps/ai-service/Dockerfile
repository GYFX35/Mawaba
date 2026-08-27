# Dockerfile for Mawaba AI Service (Python)
FROM python:3.12-slim
WORKDIR /app

COPY apps/ai-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/ai-service ./

EXPOSE 8000
CMD ["python", "main.py"]

# Dockerfile for Python AI Service (AWS ECS / AWS App Runner / AWS Lambda Container)
FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing .pyc files to disc and enable unbuffered logging
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY apps/ai-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/ai-service ./

EXPOSE 8000

CMD ["python", "main.py"]

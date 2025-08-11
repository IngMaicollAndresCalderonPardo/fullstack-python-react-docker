FROM python:3.11-slim

WORKDIR /app

# Evita mensajes de bytecode y forzamos UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalamos dependencias del sistema necesarias para psycopg2 y otros paquetes
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    
# Use the official Python 3.12 slim image as a lightweight base
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY pyproject.toml poetry.lock* /app/

# Upgrade pip, install Poetry, disable virtualenv creation, and install dependencies
RUN pip install --upgrade pip \
    && pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of the application code into the container
COPY . /app

# Expose port 8000 for the application
EXPOSE 8000

# Start the FastAPI app using uvicorn with auto-reload enabled
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

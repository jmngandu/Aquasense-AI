# Hackathoniasv

## Prerequisites

- Python 3.x
- MySQL
- pip (Python package manager)
- virtualenv (optional but recommended)

## Installation

1. Clone the project repository:
    ```bash
    git clone <REPOSITORY_URL>
    cd hackathoniasv
    ```

2. Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Create the database in MySQL:
    ```sql
    CREATE DATABASE hackathoniasv;
    ```

5. Initialize the migrations directory (if not already done):
    ```bash
    flask db init
    ```

6. Generate migration files:
    ```bash
    flask db migrate -m "Initial migration."
    ```

7. Apply migrations to the database:
    ```bash
    flask db upgrade
    ```

## Running the Application

To start the Flask application in development mode, run the following command:
```bash
python app.py

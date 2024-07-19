from dotenv import load_dotenv
import os

load_dotenv()

db_uri = f"mysql://{os.getenv('DATABASE_USER')}:{os.getenv('DATABASE_PASSWORD')}@{os.getenv('HOST')}/{os.getenv('DATABASE_NAME')}"
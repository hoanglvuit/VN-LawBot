import os 
from dotenv import load_dotenv 

load_dotenv() 

os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")

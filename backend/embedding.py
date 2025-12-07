import json 
from langchain_core.documents.base import Document
from dotenv import load_dotenv
import os 
import time
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# take environment variables
load_dotenv()  
# get key 
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
    


# load chunking list
with open("data/processed/chuking.json", "r", encoding="utf-8") as f:
    docs = json.load(f)

# Document object
Documents = []
for doc in docs:
    Documents.append(Document(page_content=doc))

# load embedding model 
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07")

# load Chroma 
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory="database/",
)

# embed by gemini embedding
for i in range(0, len(Documents), 10):
    _ = vector_store.add_documents(documents=Documents[i:i+10])
    time.sleep(59)
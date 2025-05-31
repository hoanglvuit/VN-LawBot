from ..rag import graph
from fastapi import APIRouter 
from pydantic import BaseModel

router = APIRouter() 

@router.get("/") 
def home(): 
    return "I am hoanglv, hello world"

class Question(BaseModel):
    question: str

@router.post("/qa")
def QA(data: Question):
    response = graph.invoke({"question": data.question})
    return {"answer": response["answer"]}
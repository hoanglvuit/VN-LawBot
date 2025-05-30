from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain.chat_models import init_chat_model
from langchain import hub
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict
from langchain_core.documents.base import Document
from . import config


embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07")
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings,
    persist_directory='vector_store/', 
)

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")
prompt = hub.pull("rlm/rag-prompt")
prompt.messages[0].prompt.template = """"Bạn là một trợ lý chuyên giải đáp các câu hỏi về Bộ luật Hình sự Việt Nam. Nếu người dùng chào thì hãy chào lại.
Nhiệm vụ: Tìm và suy luận câu trả lời từ ngữ cảnh được truy vấn, đồng thời xem xét các yếu tố cấu thành tội phạm và tình tiết liên quan đến lỗi (ví dụ: cố ý, vô ý, lỗi do không cẩn thận...).
Quy tắc suy luận bổ sung: Nếu ngữ cảnh chỉ nêu hậu quả và mức phạt chung, nhưng câu hỏi yêu cầu phân tích theo một tình tiết cụ thể (như 'đi đúng' hay 'đi sai') mà ngữ cảnh không nhắc đến, hãy giải thích rằng mức phạt thường phụ thuộc vào yếu tố lỗi và hành vi cụ thể, và ngữ cảnh hiện tại chưa cung cấp đủ thông tin chi tiết về lỗi để đưa ra kết luận chính xác.
Lưu ý: Nếu không thể suy luận hoặc thiếu thông tin quan trọng để trả lời chính xác, chỉ cần nói 'Tôi không biết vì ngữ cảnh không đủ thông tin chi tiết về [tình tiết thiếu]' hoặc giải thích lý do tại sao thông tin đó quan trọng.
Câu hỏi: {question}
Ngữ cảnh: {context}
Câu trả lời:"""

# Define state for application
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


# Define application steps
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}


# Compile application and test
graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

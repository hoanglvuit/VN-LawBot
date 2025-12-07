import fitz  
import re
import json

doc = fitz.open(r"raw\law_vn.pdf") 
document = ""

# Đọc tất cả các trang
for page in doc:
    text = page.get_text()
    document += text

# Xóa các tiêu đề mở đầu 
Documents = document[309:]

# Xóa các chương 
cleaned_Document = re.sub(r'Chương.*?(?=\nĐiều)', '', Documents, flags=re.DOTALL)

# Manually chunking 
def text_split(van_ban):
    dieu_luat_list = re.findall(r'(Điều\s+\d+\..*?)(?=Điều\s+\d+\.|$)', van_ban, re.DOTALL)
    return [d.strip() for d in dieu_luat_list]
chunking_docs = text_split(cleaned_Document)

# Lưu chunking list dưới dạng json tại folder processed
with open("processed/chuking.json", "w", encoding="utf-8") as f:
    json.dump(chunking_docs, f, ensure_ascii=False)

from fastapi import FastAPI,UploadFile,File


app = FastAPI()



@app.get('/')
def home():
    return "rezum1 an ai based resume analyzer"

@app.post('/upload')
async def upload (file: UploadFile = File(...)):
    content  = await file.read()
    
    try :
        text = content.decode("utf-8")
    except UnicodeDecodeError:
            text = content.hex()
        
    return {
        "filename" : file.filename,
        "content" : text
    }
    
@app.post("/save")
async def save_file(file : UploadFile =File(...)):
    content =  await file.read
    with open(file.filename, "wb") as f:
        f.write(content)
    return  {"message" : f"{file.filename} saved successfully !"}
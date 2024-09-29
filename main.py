from fastapi import FastAPI, UploadFile, File,HTTPException,Request
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import requests
import json
from dotenv import load_dotenv
import google.generativeai as genai
import pathlib
import re
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIRECTORY = "uploaded_images"
Path(UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)

convo=[]


def detect_text(file_path):
    genai.configure(api_key=os.environ["API_KEY"])
    media = pathlib.Path(__file__).parents[1] / r"Ai CHATBOT"
    myfile = genai.upload_file(media / f"{file_path}")
    print(f"{myfile=}")
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content(
        [myfile, "\n\n", "Can you extract text from the image and respond it in clean text "]
    )
    
    
    string = result.text
    convo.append(string)
    return string
    
    
    
    
    
@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    # Create a file path where the image will be stored
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)

    # Write the file to the specified path
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Process the image and get detection results
    detection_results = detect_text(file_path)
    
    return {"detection_results": detection_results}


class Message(BaseModel):
    text: str

@app.post("/gemini_message/")
async def geminimessage(msg: Message, request: Request):
    try:
        genai.configure(api_key=os.environ["API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate content based on the incoming message
        result = model.generate_content([msg.text])
        
        # Log the result to inspect its structure
        print("Result:", result)

        # Check if result is in expected format
        if hasattr(result, 'text'):
            return {"text": result.text}  # Assuming result has a 'text' attribute
        elif hasattr(result, 'parts'):
            return {"text": result.parts[0]}  # If parts is available
        else:
            return {"text": str(result)}  # Fallback to string representation of result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

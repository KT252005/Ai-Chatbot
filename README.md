Ai ChatBot 
setup:
First Clone the Repository via :
command 
```bash
git clone "https://github.com/KT252005/Ai-Chatbot.git"
```

Then Create Virtual Environment :
\n Command:
``` python -m venv "Your_wanted_env_Name"    ```

Then install dependencies by running the following commands :
```bash
pip install -r "requirements.txt"
```

*Create Gemini Api Key via this website :point_right:[Create Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)
\n Put in .env file Variable Api_key input 

***
Now you good to go 
At last just run main.py in python terminal in 4000 port 
```bash
uvicorn main:app --reload --port 4000 
```
Your Backend is ready 
Now Add extention By selecting "Load unpacked" in developer mode 
Select Location of Popup.html that is in 
```
django-webinterface\aibot
```

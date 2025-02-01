from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import transformers
import torch
from transformers import AutoTokenizer
from time import time
import ngrok
from pymongo import MongoClient
from urllib.parse import quote_plus
import re  # For date extraction

app = FastAPI()

class ValidateRequest(BaseModel):
    user_id: str
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Load the model and tokenizer
model = "/kaggle/input/llama-3/transformers/8b-chat-hf/1"
tokenizer = AutoTokenizer.from_pretrained(model)

pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    torch_dtype=torch.float16,
    device_map="auto"
)

ngrok.set_auth_token("2lC10VNMNNHozy9qU2wBzosN3at_3QYjZW2FJ2sr1po7qXqqs")
listener = ngrok.forward("127.0.0.1:8000", authtoken_from_env=True, domain="sterling-python-willingly.ngrok-free.app")

username = quote_plus('thissya129')
password = quote_plus('Thissya129')
uri = f'mongodb+srv://thissya129:Thissya129@energymanagement.zn8ue.mongodb.net/?retryWrites=true&w=majority&appName=EnergyManagement'

client = MongoClient(uri)  
db = client['energy_management']  

user_histories = {}

def extract_date(user_message):
    date_pattern = r"\b\d{2}\.\d{2}\.\d{4}\b|\b\d{4}-\d{2}-\d{2}\b"
    match = re.search(date_pattern, user_message)
    if match:
        return match.group()  
    return None

# Query model to generate a response
def query_model(system_message, user_message, history, temperature=0.7, max_length=1024):
    user_message = "Question: " + user_message + " Answer:"
    messages = history + [{"role": "user", "content": user_message}]
    prompt = pipeline.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    terminators = [pipeline.tokenizer.eos_token_id, pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")]

    sequences = pipeline(
        prompt,
        do_sample=True,
        top_p=0.9,
        temperature=temperature,
        eos_token_id=terminators,
        max_new_tokens=max_length,
        return_full_text=False,
        pad_token_id=pipeline.model.config.eos_token_id
    )
    answer = sequences[0]['generated_text']
    return answer, messages

system_message = """
You are a chatbot designed to assist users with queries related to energy management at KEC. This includes providing information about energy consumption, solar energy data, and general energy-related details. 
If a user asks for data related to energy or solar for a specific date, extract the date and the type of data (electricity or solar) from the query and return them to the query_model in the format {date, collection_name}. The collection_name will either be 'energy' or 'solar' depending on the query. If the user does not mention a date, respond directly using predefined responses or general information about energy management.
You are also responsible for providing predefined static information about energy forecasts, energy-saving tips, and general project details based on user queries.
"""

# Function to retrieve data from MongoDB
def retrieve_data_from_db(date: str, collection_name: str):
    collection = db[collection_name]
    query = {"date": date}
    result = collection.find_one(query)
    if result:
        return result
    else:
        return None

@app.post('/message')
async def message(request: ValidateRequest):
    try:
        global user_histories
        user_id = request.user_id
        user_message = request.message

        # Extract collection (solar_energy or electrical_energy) from user_message
        if "solar" in user_message.lower():
            collection_name = "solar_energy"
        elif "energy" in user_message.lower() or "electricity" in user_message.lower():
            collection_name = "electrical_energy"
        else:
            collection_name = None

        # Extract date from message using the new regex function
        date = extract_date(user_message)

        if date and collection_name:
            # Retrieve data from the database
            data = retrieve_data_from_db(date, collection_name)
            if data:
                return {"response": f"The {collection_name} data for {date} is {data['value']}."}
            else:
                return {"response": f"No data found for {date} in the {collection_name} collection."}
        else:
            # If no date or collection is found, fall back to general chat functionality
            history = user_histories.get(user_id, [{"role": "system", "content": system_message}])
            response, updated_history = query_model(system_message, user_message, history)
            user_histories[user_id] = updated_history
            user_histories[user_id] = user_histories[user_id][-3:]  # Keep only last 3 messages for history
            return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

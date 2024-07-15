import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import pandas as pd
import threading
import pandas as pd
import ast
from supabase import create_client, Client
from statsmodels.tsa.arima.model import ARIMA
from fastapi.responses import JSONResponse
from pandas.tseries.offsets import DateOffset


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url = "https://foltrvqbdhiolcriszcb.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbHRydnFiZGhpb2xjcmlzemNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzNzMwOTMsImV4cCI6MjAyOTk0OTA5M30.TSxl7-7Fgy_TJ_OXAJ_-KXU51S3sNPzb-XOSeeh3lmQ"
supabase: Client = create_client(url, key)

@app.post("/predict_energy")
def predict():
    response = supabase.table('totalenergycost').select("Date, Total").execute()
    data = response.data
    data = str(data)
    data = data[1:-1]
    data = ast.literal_eval(data)  
    df = pd.DataFrame(data)
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    model = ARIMA(df['Total'], order=(3,1,3))
    model_fit = model.fit()
    prediction = model_fit.forecast(steps=12)
    prediction = prediction.round()

    prediction.index = pd.to_datetime(prediction.index)
    result_df = pd.DataFrame({
        'Date': prediction.index.strftime('%Y-%m-%d'),
        "Prediction" : prediction
    })
    result_df.reset_index(drop=True, inplace=True)
    return JSONResponse(content=result_df.to_dict(orient="records"))

@app.post("/predict_solar")
def predict():
    response = supabase.table('totalsolarcost').select("Date, Total").execute()
    data = response.data
    data = str(data)
    data = data[1:-1]
    data = ast.literal_eval(data)  
    df = pd.DataFrame(data)
    df['Date'] = pd.to_datetime(df['Date'])
    print(df['Date'])
    df.set_index('Date', inplace=True)
    model = ARIMA(df['Total'], order=(3,1,3))
    model_fit = model.fit()
    prediction = model_fit.forecast(steps=12)
    prediction = prediction.round()

    future_dates = [df.index[-1] + DateOffset(days=x) for x in range(1, 13)]
    prediction.index = pd.DatetimeIndex(future_dates)
    result_df = pd.DataFrame({
        'Date': prediction.index.strftime('%Y-%m-%d'),
        "Prediction" : prediction
    })

    result_df.reset_index(drop=True, inplace=True)
    print(result_df.to_dict(orient="records"))
    return JSONResponse(content=result_df.to_dict(orient="records"))
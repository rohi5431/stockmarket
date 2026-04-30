from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
log_reg = None
iso_forest = None

model_dir = "models"
if os.path.exists(f"{model_dir}/logistic_model.pkl") and os.path.exists(f"{model_dir}/isolation_forest.pkl"):
    log_reg = joblib.load(f"{model_dir}/logistic_model.pkl")
    iso_forest = joblib.load(f"{model_dir}/isolation_forest.pkl")
else:
    print("Warning: Models not found. Please run train.py first.")

class StockData(BaseModel):
    price_change: float
    moving_average: float
    volume: float

@app.get("/")
def read_root():
    return {"message": "ML Service is running. Use POST /predict-signal or /detect-anomaly"}

@app.post("/predict-signal")
def predict_signal(data: StockData):
    if not log_reg:
        return {"error": "Model not loaded"}
    
    features = np.array([[data.price_change, data.moving_average, data.volume]])
    prediction = log_reg.predict(features)[0]
    probabilities = log_reg.predict_proba(features)[0]
    
    confidence = float(max(probabilities))
    signal = "Buy" if prediction == 1 else "Sell"
    
    return {
        "signal": signal,
        "confidence": confidence
    }

@app.post("/detect-anomaly")
def detect_anomaly(data: StockData):
    if not iso_forest:
        return {"error": "Model not loaded"}
    
    features = np.array([[data.price_change, data.moving_average, data.volume]])
    anomaly_prediction = iso_forest.predict(features)[0]
    
    # IsolationForest returns -1 for anomaly, 1 for normal
    is_anomaly = bool(anomaly_prediction == -1)
    
    # Calculate anomaly score (lower is more anomalous)
    score = float(iso_forest.score_samples(features)[0])
    
    return {
        "is_anomaly": is_anomaly,
        "score": score
    }

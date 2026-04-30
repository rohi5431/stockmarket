import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import IsolationForest
import joblib
import os

os.makedirs('models', exist_ok=True)

# Generate synthetic dataset for training
np.random.seed(42)
n_samples = 1000

# Features: price_change, moving_average, volume
price_change = np.random.normal(0, 2, n_samples)
moving_average = np.random.normal(100, 10, n_samples)
volume = np.random.normal(5000, 2000, n_samples)

X = pd.DataFrame({
    'price_change': price_change,
    'moving_average': moving_average,
    'volume': volume
})

# Labels for Logistic Regression (Buy: 1, Sell: 0)
# Simple rule: if price_change > 0 and volume > 5000 -> Buy (1), else Sell (0)
y = ((price_change > 0) & (volume > 5000)).astype(int)

# 1. Train Logistic Regression for Trading Signal
log_reg = LogisticRegression()
log_reg.fit(X, y)
joblib.dump(log_reg, 'models/logistic_model.pkl')
print("Logistic Regression model trained and saved.")

# 2. Train Isolation Forest for Anomaly Detection
iso_forest = IsolationForest(contamination=0.05, random_state=42)
iso_forest.fit(X)
joblib.dump(iso_forest, 'models/isolation_forest.pkl')
print("Isolation Forest model trained and saved.")

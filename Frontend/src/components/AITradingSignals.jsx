import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const AITradingSignals = ({ symbol, price, change }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Simulated features based on price and change
      const price_change = parseFloat(change.replace('%', '')) || 0;
      const moving_average = price * 0.98; // Simulated MA
      const volume = Math.random() * 10000 + 1000; // Simulated Volume

      const response = await axios.post(`${API_URL}/api/ai/insights/${symbol}`, {
        price_change,
        moving_average,
        volume
      });
      
      setInsights(response.data);

      if (response.data.is_anomaly) {
        addNotification(`⚠️ Anomaly Detected for ${symbol}! Score: ${response.data.anomaly_score.toFixed(2)}`);
      }
      if (response.data.confidence > 0.8) {
        addNotification(`💡 Strong ${response.data.signal} Signal for ${symbol}!`);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to fetch ML insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [symbol, price, change]);

  const SignalIcon = insights?.signal === 'Buy' ? TrendingUp : insights?.signal === 'Sell' ? TrendingDown : Activity;
  const signalColor = insights?.signal === 'Buy' ? 'bg-green-100 text-green-700' : insights?.signal === 'Sell' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-200 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          ML Trading Signals
        </h3>
      </div>

      {loading && !insights && (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500">Running ML models for {symbol}...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {insights && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Trading Signal</span>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase flex items-center gap-2 ${signalColor}`}>
              <SignalIcon className="w-4 h-4" />
              {insights.signal}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Confidence Score</span>
            <div className="text-sm font-bold text-indigo-600">
              {(insights.confidence * 100).toFixed(1)}%
            </div>
          </div>

          {insights.is_anomaly && (
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-2 mt-4">
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-0.5">Anomaly Detected</h4>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Unusual market activity detected by Isolation Forest model. Score: {insights.anomaly_score.toFixed(3)}
                </p>
              </div>
            </div>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className={`h-2 rounded-full ${insights.signal === 'Buy' ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${insights.confidence * 100}%` }}
            ></div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AITradingSignals;

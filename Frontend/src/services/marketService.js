import axios from "axios";

const API_BASE = "http://localhost:5000/api/market";

// Cache to avoid spamming backend
const quoteCache = new Map();

export const getQuote = async (symbol) => {
  const now = Date.now();
  const cached = quoteCache.get(symbol);

  // Use cached value if it's less than 30 seconds old
  if (cached && now - cached.timestamp < 30000) {
    return cached.data;
  }

  try {
    const response = await axios.get(`${API_BASE}/quote/${symbol}`);
    quoteCache.set(symbol, { data: response.data, timestamp: now });
    return response.data;
  } catch (err) {
    console.error(`Error fetching quote for ${symbol}:`, err.message);
    return { c: null, pc: null }; // fallback to avoid crashing UI
  }
};

export const searchSymbol = async (query) => {
  const response = await axios.get(`${API_BASE}/search/${query}`);
  return response.data;
};

export async function getHistorical(symbol) {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    t: now - (30 - i) * 60 * 1000,
    c: 100 + Math.sin(i / 3) * 5 + Math.random() * 2,
  }));
}

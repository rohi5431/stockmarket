# 📈 Stock Market Platform

A full-stack stock market simulation platform, with real-time data streaming, portfolio tracking, strategy management, and authentication.  
Built using **Node.js**, **Express**, **Socket.IO**, **MongoDB**, **Redis**, and **React**.

---

# 🌐 Demo

<img width="1666" height="918" alt="Screenshot 2025-10-26 212528" src="https://github.com/user-attachments/assets/605a80f1-da4f-44f4-a601-d81b0e52cb97" />

<img width="1900" height="927" alt="Screenshot 2025-10-26 213139" src="https://github.com/user-attachments/assets/16ddf8c1-98e8-48eb-a313-45414896c5b8" />

<img width="1840" height="838" alt="Screenshot 2025-10-26 213429" src="https://github.com/user-attachments/assets/fceb5058-c5b0-46d4-b951-62aded594225" />

<img width="1880" height="924" alt="Screenshot 2025-10-26 213543" src="https://github.com/user-attachments/assets/bf10be45-12af-4332-ab6e-52a22aed7c64" />

<img width="1903" height="929" alt="Screenshot 2025-10-26 212453" src="https://github.com/user-attachments/assets/74a517f4-320c-4d74-95d1-30572eef98e9" />

---

# 🚀 Features

### 🔹 Backend

- **REST API**, for portfolio, market, and order management  
- **WebSocket live feed**, using Finnhub API (`server.js`)  
- **Real-time strategies & authentication service**, (`str.js`)  
- **MongoDB**, for persistent storage  
- **Redis**, for caching and performance  

### 🔹 Frontend

- **React (Vite) client**  
- **Real-time updates**, powered by Socket.IO  
- **Portfolio visualization**, trades feed, and top movers  
- **Authentication & strategy tracking**

---

# 📂 Project Structure

```
stockmarket/
│
├── Backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── store/
│ │ ├── server.js
│ │ └── str.js
│ │
│ ├── .env
│ ├── package.json
│ ├── package-lock.json
│ └── README.md
│
├── Frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── lib/
│ │ ├── pages/
│ │ ├── services/
│ │ └── styles/
│ │ ├── App.css
│ │ ├── index.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ ├── public/
│ ├── package.json
│ ├── package-lock.json
│ └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🛠️ Tech Stack

- **Backend:** Node.js, Express, Socket.IO, WebSocket, Axios  
- **Database:** MongoDB (Mongoose ORM)  
- **Cache:** Redis  
- **Frontend:** React (Vite), Context API, Hooks  
- **Tools:** Concurrently, dotenv, CORS  

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| **GET** | `/api/portfolio` | Fetch portfolio data |
| **GET** | `/api/market` | Fetch market data |
| **POST** | `/api/order` | Place an order |
| **POST** | `/api/auth` | User authentication |
| **GET** | `/api/strategies` | Fetch strategies list |

---

# 🔹 Example API Usage

### 1️⃣ Get Portfolio Data

**Request**

```
GET /api/portfolio
```

**Response**

```json
{
 "portfolioValue": 10500,
 "positions": [
  { "symbol": "AAPL", "qty": 10, "avgPrice": 150, "currentPrice": 155 },
  { "symbol": "TSLA", "qty": 5, "avgPrice": 700, "currentPrice": 710 }
 ],
 "unrealizedPnL": 200,
 "realizedPnL": 500
}
```

---

### 2️⃣ Get Market Data

**Request**

```
GET /api/market
```

**Response**

```json
[
 { "symbol": "AAPL", "price": 155.2, "change": "+0.5%" },
 { "symbol": "TSLA", "price": 710.0, "change": "-0.3%" },
 { "symbol": "NVDA", "price": 450.5, "change": "+1.2%" }
]
```

---

### 3️⃣ Place Order

**Request**

```
POST /api/order
Content-Type: application/json
```

```json
{
 "symbol": "AAPL",
 "type": "BUY",
 "qty": 5,
 "price": 156
}
```

**Response**

```json
{
 "success": true,
 "message": "Order placed successfully",
 "order": {
  "id": "ORD12345",
  "symbol": "AAPL",
  "type": "BUY",
  "qty": 5,
  "price": 156,
  "status": "EXECUTED"
 }
}
```

---

### 4️⃣ User Authentication

**Request**

```
POST /api/auth
Content-Type: application/json
```

```json
{
 "username": "rohit",
 "password": "mypassword123"
}
```

**Response**

```json
{
 "success": true,
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

---

### 5️⃣ Get Strategies

**Request**

```
GET /api/strategies
```

**Response**

```json
[
 {
  "symbol": "AAPL",
  "name": "Apple",
  "roi": "+5.2%",
  "return": "$1200",
  "followers": 100,
  "winRate": "75%"
 },
 {
  "symbol": "TSLA",
  "name": "Tesla",
  "roi": "+12.3%",
  "return": "$2100",
  "followers": 150,
  "winRate": "80%"
 }
]
```

---

# 🔄 WebSocket Events

### From `server.js`

```
portfolioUpdate
pnlUpdate
tradesUpdate
marketUpdate
```

### From `str.js`

```
strategiesUpdate
```

---

# ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rohi5431/stockmarket.git
cd stockmarket
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside **Backend/**

```
MONGO_URI=mongodb://localhost:27017/stockmarket
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
FINNHUB_API_KEY=your_finnhub_api_key
PORT1=5000
PORT2=7000
```

---

### 3️⃣ Frontend Setup

```bash
cd ../Frontend
npm install
```

---

# ▶️ Running the Project

Run both backend and frontend servers.

### Backend

```bash
cd Backend
npm run dev
```

### Frontend

```bash
cd Frontend
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

# ✍️ Author

**Rohit Kumar**

💻 Full-Stack Developer | 📊 Stock Market Enthusiast  

- GitHub: https://github.com/rohi5431  
- LinkedIn: Rohit Kumar  
- Email: rohit60316@gmail.com

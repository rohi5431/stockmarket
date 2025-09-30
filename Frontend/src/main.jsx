import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx"; // ✅ import WalletProvider
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider> {/* ✅ Must wrap WalletProvider */}
        <WalletProvider>
          <App />
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);

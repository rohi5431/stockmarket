import React, { createContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext.jsx";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("wallet_balance");
    return saved ? Number(saved) : 125000;
  });

  const { addNotification } = useNotification();

  useEffect(() => {
    localStorage.setItem("wallet_balance", balance);
  }, [balance]);

  const deposit = (amount) => {
    setBalance((prev) => prev + amount);
    addNotification(`Deposited ₹${amount.toLocaleString()}`);
  };

  const withdraw = (amount) => {
    if (amount > balance) {
      addNotification("Withdrawal failed: insufficient funds");
      return;
    }
    setBalance((prev) => prev - amount);
    addNotification(`Withdrew ₹${amount.toLocaleString()}`);
  };

  return (
    <WalletContext.Provider value={{ balance, setBalance, deposit, withdraw }}>
      {children}
    </WalletContext.Provider>
  );
};

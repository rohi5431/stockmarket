import { useState, useEffect } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";

const WalletModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(1000); // default
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem("wallet_balance");
    const savedTxns = localStorage.getItem("wallet_transactions");

    if (savedBalance) setBalance(JSON.parse(savedBalance));
    if (savedTxns) setTransactions(JSON.parse(savedTxns));
  }, []);

  // Save balance & transactions whenever they change
  useEffect(() => {
    localStorage.setItem("wallet_balance", JSON.stringify(balance));
    localStorage.setItem("wallet_transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  // Deposit
  const handleDeposit = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) {
      alert("Enter a valid amount to deposit");
      return;
    }
    setBalance((prev) => prev + amt);
    setTransactions((prev) => [
      { type: "Deposit", amount: amt, id: Date.now() },
      ...prev,
    ]);
    alert(`Deposit Successful ✅ (₹${amt})`);
    setAmount("");
  };

  // Withdraw
  const handleWithdraw = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) {
      alert("Enter a valid amount to withdraw");
      return;
    }
    if (balance >= amt) {
      setBalance((prev) => prev - amt);
      setTransactions((prev) => [
        { type: "Withdraw", amount: amt, id: Date.now() },
        ...prev,
      ]);
      alert(`Withdrawal Successful ✅ (₹${amt})`);
      setAmount("");
    } else {
      alert("Insufficient Balance ❌");
    }
  };

  return (
    <>
      {/* Wallet Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#e6f2ff] text-gray-800 font-semibold shadow hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <Wallet size={20} className="text-green-500 animate-pulse" />
        <span>Wallet</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-gray-50 text-gray-800 rounded-2xl shadow-xl w-[420px] p-6 relative animate-fade-in">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            {/* Wallet Info */}
            <div className="flex flex-col items-center space-y-3">
              <Wallet size={40} className="text-green-500" />
              <h2 className="text-2xl font-bold">My Wallet</h2>
              <p className="text-lg">
                Balance:{" "}
                <span className="text-green-500 font-semibold">₹{balance}</span>
              </p>
            </div>

            {/* Amount Input */}
            <div className="mt-6">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (₹)"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col space-y-4">
              <button
                onClick={handleDeposit}
                className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                disabled={!amount || parseInt(amount) <= 0}
              >
                <ArrowDownCircle size={20} />
                <span>Deposit</span>
              </button>
              <button
                onClick={handleWithdraw}
                className="flex items-center justify-center space-x-2 bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                disabled={!amount || parseInt(amount) <= 0}
              >
                <ArrowUpCircle size={20} />
                <span>Withdraw</span>
              </button>
            </div>

            {/* Transaction History */}
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-3">
                <History size={20} className="text-yellow-500" />
                <h3 className="text-lg font-semibold">Transaction History</h3>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No transactions yet.</p>
                ) : (
                  transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
                        txn.type === "Deposit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span>{txn.type}</span>
                      <span>₹{txn.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default WalletModal;

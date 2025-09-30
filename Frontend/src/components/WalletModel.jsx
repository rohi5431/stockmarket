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

    if (window.Razorpay) {
      const options = {
        key: "rzp_test_xxxxxxxx", // replace with your Razorpay key
        amount: amt * 100,
        currency: "INR",
        name: "Stockify Wallet",
        description: "Deposit Money",
        handler: function (response) {
          alert(`Deposit Successful ✅\nPayment ID: ${response.razorpay_payment_id}`);
          setBalance((prev) => prev + amt);
          setTransactions((prev) => [
            { type: "Deposit", amount: amt, id: Date.now() },
            ...prev,
          ]);
          setAmount("");
        },
        prefill: { name: "Rohit Kumar", email: "rohit@example.com", contact: "9876543210" },
        theme: { color: "#16a34a" },
      };
      new window.Razorpay(options).open();
    } else {
      // fallback if Razorpay not loaded
      setBalance((prev) => prev + amt);
      setTransactions((prev) => [
        { type: "Deposit", amount: amt, id: Date.now() },
        ...prev,
      ]);
      alert(`Deposit Successful ✅ (₹${amt})`);
      setAmount("");
    }
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
        className="relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-emerald-400/40 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <Wallet size={20} className="animate-pulse" />
        <span>Wallet</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl w-[420px] p-6 relative animate-fade-in">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* Wallet Info */}
            <div className="flex flex-col items-center space-y-3">
              <Wallet size={40} className="text-green-400" />
              <h2 className="text-2xl font-bold">My Wallet</h2>
              <p className="text-lg">
                Balance:{" "}
                <span className="text-green-400 font-semibold">${balance}</span>
              </p>
            </div>

            {/* Amount Input */}
            <div className="mt-6">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount ($)"
                className="w-full px-4 py-2 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col space-y-4">
              <button
                onClick={handleDeposit}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                disabled={!amount || parseInt(amount) <= 0}
              >
                <ArrowDownCircle size={20} />
                <span>Deposit</span>
              </button>
              <button
                onClick={handleWithdraw}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                disabled={!amount || parseInt(amount) <= 0}
              >
                <ArrowUpCircle size={20} />
                <span>Withdraw</span>
              </button>
            </div>

            {/* Transaction History */}
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-3">
                <History size={20} className="text-yellow-400" />
                <h3 className="text-lg font-semibold">Transaction History</h3>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No transactions yet.</p>
                ) : (
                  transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm ${
                        txn.type === "Deposit"
                          ? "bg-green-700/30 text-green-300"
                          : "bg-red-700/30 text-red-300"
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

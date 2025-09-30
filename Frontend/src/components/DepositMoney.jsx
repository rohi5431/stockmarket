import { Wallet } from "lucide-react"; // install lucide-react if not already

const DepositMoney = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center space-x-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r
       from-green-500 to-emerald-600 text-white font-semibold shadow-lg
       hover:shadow-emerald-400/40 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
    >
      <Wallet size={20} className="animate-pulse" />
      <span>Deposit Money</span>

      {/* Glow effect */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 blur-lg -z-10"></span>
    </button>
  );
};

export default DepositMoney;

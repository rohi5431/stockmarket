import { Bell } from "lucide-react";
import { useNotification } from "../context/NotificationContext.jsx";

const NotificationButton = () => {
  const { notifications } = useNotification();
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button className="p-2 rounded-full hover:bg-gray-700 transition">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {unreadCount > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 border-b border-gray-700 text-sm">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationButton;

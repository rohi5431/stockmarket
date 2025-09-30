import { useNotification } from "../context/NotificationContext";

const NotificationList = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div key={n.id} className="bg-gray-800 text-white px-4 py-2 rounded shadow">
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;

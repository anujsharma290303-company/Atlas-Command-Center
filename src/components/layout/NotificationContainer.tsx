import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { removeNotification } from "../../features/notification/notificationSlice";
import { useEffect } from "react";

const NotificationContainer = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.queue);
  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => dispatch(removeNotification(n.id)), 5000),
    );
    return () => timers.forEach(clearTimeout);
  },[notifications,dispatch]);
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 flex flex-col-reverse">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-slate-900 text-white border border-white/10 px-4 py-3 rounded-lg shadow-md w-64"
        >
          <p className="text-sm">{n.message}</p>

          <button
            onClick={() => dispatch(removeNotification(n.id))}
            className="text-xs text-sky-400 mt-1"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

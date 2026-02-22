import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { logout } from "../features/auth/authSlice";

export const useAuthSync = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "auth_event" || !event.newValue) return;

      try {
        const data = JSON.parse(event.newValue);

        if (data.type === "logout") {
          dispatch(logout());
        }
      } catch {
         console.log("Invalid auth sync payload");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);
};

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import type { RootState } from "../../store/store";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/10 bg-slate-900">
      <h1 className="text-base md:text-lg font-semibold truncate">
        Atlas Command Center
      </h1>

      <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-300">
        {user && (
          <>
            {user.image && (
              <img
                src={user.image}
                alt="user"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full"
              />
            )}
            <span className="hidden sm:inline">{user.firstName}</span>
            
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded-md bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
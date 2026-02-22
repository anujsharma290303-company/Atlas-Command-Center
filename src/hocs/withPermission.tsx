import { useSelector } from "react-redux";
import type { RootState } from "../store/store"
import { permissionMatrix } from "../config/permissionMatrix";
import type { Permission } from "../types/permissions";

const withPermission =
  (requiredPermission: Permission) =>
  <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithPermission = (props: P) => {
      const role = useSelector((state: RootState) => state.auth.user?.role);

      if (!role) return null;

      const hasPermission = permissionMatrix[role].includes(requiredPermission);

      if (!hasPermission) {
        return (
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 text-white shadow-md flex items-center justify-center min-h-32">
            <p className="text-gray-400 text-sm">
              🔒 You don't have permission to view this widget
            </p>
          </div>
        );
      }

      return <WrappedComponent {...props} />;
    };

    WithPermission.displayName = `WithPermission(${
      WrappedComponent.displayName ?? WrappedComponent.name
    })`;

    return WithPermission;
  };

export default withPermission;
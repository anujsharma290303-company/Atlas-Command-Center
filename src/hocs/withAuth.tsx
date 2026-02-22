import type { ComponentType, ReactElement } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

interface WithAuthOptions {
  redirectTO?: string;
  fallback?: ReactElement | null;
}

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions,
) {
  const { redirectTO = "/", fallback = null } = options || {};

  const ComponentWithAuth = (props: P) => {
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated,
    );

    if (!isAuthenticated) {
      if (fallback) return fallback;
      return <Navigate to={redirectTO} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}

export default withAuth;

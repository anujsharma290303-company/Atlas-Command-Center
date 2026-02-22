import { useEffect } from "react";

type QueryHookResult = {
  refetch: () => void;
};

const withDataRefresh =
  <P extends object>(
    useQueryHook: () => QueryHookResult,
    interval: number = 60000,
  ) =>
  (WrappedComponent: React.ComponentType<P>) => {
    
    const WithDataRefresh = (props: P) => {
      const queryResult = useQueryHook();

      useEffect(() => {
        const timer = setInterval(() => {
          queryResult.refetch();
        }, interval);
        return () => clearInterval(timer);
      }, [queryResult]);

      return <WrappedComponent {...props} />;
    };

    return WithDataRefresh;
  };

export default withDataRefresh;
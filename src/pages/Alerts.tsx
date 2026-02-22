import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addAlertConfig } from "../features/Alerts/alertSlice"; // matches alerts: alertReducer in store
import AlertTimeline from "../components/generic/AlertTimeline";

const Alerts = () => {
  const dispatch = useAppDispatch();

  const history = useAppSelector(
    (s) => s.alerts.history // ✅ matches store key: alerts: alertReducer
  );

  const createBTCAlert = () => {
    dispatch(
      addAlertConfig({
        id: crypto.randomUUID(),
        type: "crypto",
        metric: "price",
        condition: "below",
        threshold: 60000,
        target: "BTC",
      })
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alerts & Monitoring</h1>

      <button
        onClick={createBTCAlert}
        className="px-4 py-2 bg-sky-500 rounded"
      >
        Add BTC Alert
      </button>

      <AlertTimeline history={history} />
    </div>
  );
};

export default Alerts;
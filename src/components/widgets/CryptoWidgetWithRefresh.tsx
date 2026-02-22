import withDataRefresh from "../../hocs/withDataRefresh";
import { useGetMarketCoinsQuery } from "../../api/cryptoApi";
import CryptoWidget from "./CryptoWidget";


const CryptoWidgetWithRefresh = withDataRefresh(
  useGetMarketCoinsQuery,
  30000,
)(CryptoWidget);

export default CryptoWidgetWithRefresh;
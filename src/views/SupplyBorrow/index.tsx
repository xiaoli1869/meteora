import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import CenterContent from "@/components/CenterContent";
import Header from "@/components/Header";
function SupplyBorrow() {
  const { Store } = useStore();
  const nav = useNavigate();
  return (
    <CenterContent>
      <Header />
    </CenterContent>
  );
}
export default observer(SupplyBorrow);

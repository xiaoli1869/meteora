import { observer } from "mobx-react-lite";
import LendingAndDepositTable from "@/components/LendingAndDepositTable";
import { useTranslation } from "react-i18next";

export default observer(function () {
  const { t } = useTranslation("translations");
  const HealthDegree = ({ lev }: { lev: number }) => {
    let content: any = [];
    const itemDiv = (bg: string) => (
      <div className="w-1 h-4" style={{ background: bg }} />
    );
    for (let i = 0; i < lev; i++) {
      switch (lev) {
        case 1:
          content.push(itemDiv("#25CA83"));
          break;
        case 2:
          content.push(itemDiv("#25CA83"));
          break;
        case 3:
          content.push(itemDiv("#F76816"));
          break;
        case 4:
          content.push(itemDiv("#F44960"));
          break;
        case 5:
          content.push(itemDiv("#F44960"));
          break;
        default:
          break;
      }
    }
    for (let i = 0; i < 5 - lev; i++) {
      content.push(itemDiv("#30333D"));
    }
    return <div className="flex gap-x-0.5">{content}</div>;
  };
  const ClaimFeesColumns = [
    {
      title: t("claimFees.tab1"),
      dataIndex: "",
      key: "",
      render: () => {
        return "SUSHI - BTC";
      },
    },

    {
      title: t("claimFees.tab2"),
      dataIndex: "",
      key: "",
      render: () => {
        return (
          <div className="flex items-center gap-x-1">
            3158062
            <HealthDegree lev={4} />
          </div>
        );
      },
    },
    {
      title: t("claimFees.tab3"),
      dataIndex: "",
      key: "",
      align: "right",
      render: () => {
        return (
          <div className="text-right">
            <div>122,850.2371</div>
            <div>17.2816</div>
          </div>
        );
      },
    },
  ];
  const ClaimFeesData = [{}, { children: [{}] }];
  return (
    <LendingAndDepositTable
      title={t("lendingTable.title")}
      columns={ClaimFeesColumns}
      data={ClaimFeesData}
    />
  );
});

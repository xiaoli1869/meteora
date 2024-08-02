import { Table } from "antd";
import "@/assets/css/table.css";
import { useTranslation } from "react-i18next";
import MyButton from "../MyButton";
import { observer } from "mobx-react-lite";
type propsType = {
  columns: any;
  data: any;
  setSelectRows: (keys: any) => void;
};
export default observer(function ({ columns, data, setSelectRows }: propsType) {
  const { t } = useTranslation("translations");
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectRows(selectedRowKeys);
    },
  };
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={rowSelection}
      />
      <div className="mt-10">
        <div className="text-white opacity-50 text-center">
          {t("claimFees.tips")}
        </div>
        <MyButton disabled className="w-full mt-2 text-18 h-14 box-border">
          {t("claimFees.button")}
        </MyButton>
      </div>
    </>
  );
});

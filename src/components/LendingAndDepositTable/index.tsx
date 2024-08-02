import { Table } from "antd";
import "@/assets/css/table.css";
import { observer } from "mobx-react-lite";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
type propsType = {
  columns: any;
  data: any;
  title: string;
};
export default observer(function (props: propsType) {
  return (
    <div
      className="w-full rounded-lg pt-4 pb-4 pl-1 pr-1 mt-2"
      style={{ background: "#151619" }}
    >
      <div className="text-18 font-bold text-white pl-3 ">{props.title}</div>
      <Table
        columns={props.columns}
        dataSource={props.data}
        pagination={false}
        expandable={{
          expandRowByClick: true,
          expandedRowClassName: () => "myOpenTableBg",
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.children) {
              if (expanded) {
                return (
                  <UpOutlined
                    className="mr-1"
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              } else {
                return (
                  <DownOutlined
                    className="mr-1"
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              }
            } else {
              return "";
            }
          },
        }}
      />
    </div>
  );
});

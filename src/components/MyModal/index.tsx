import { Modal } from "antd";
import "./index.css";
import { CloseOutlined } from "@ant-design/icons";
export default function ({
  children,
  open,
  width,
  onCancel,
  title,
}: {
  children: any;
  open: boolean;
  onCancel: () => void;
  title?: string;
  width?: string | number;
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={width}
      destroyOnClose
    >
      <div
        className="w-full box-border rounded-xl text-white"
        style={{
          padding: "16px 20px",
          background: "#151619",
          border: "1px solid #151619",
        }}
      >
        {title ? (
          <div className="mb-4 flex justify-between items-center">
            <span className="text-16 font-bold">{title}</span>
            <CloseOutlined className="w-4 h-4" onClick={onCancel} />
          </div>
        ) : null}
        {children}
      </div>
    </Modal>
  );
}

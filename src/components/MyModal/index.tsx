import { Modal } from "antd";
import "./index.css";
export default function ({
  children,
  open,
  width,
  onCancel,
}: {
  children: any;
  open: boolean;
  onCancel: () => void;
  width?: string | number;
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={width}
    >
      {children}
    </Modal>
  );
}

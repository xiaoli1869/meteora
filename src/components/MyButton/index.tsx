import { Button } from "antd";
import "./index.css";
type propsType = {
  children: any;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
};
export default function MyButton({
  children,
  disabled,
  loading,
  onClick,
  className,
}: propsType) {
  return (
    <Button
      className={
        "rounded-lg border-none font-bold hover:opacity-80 " + className
      }
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      style={{
        background: disabled ? "rgba(252, 239, 98, 0.1)" : "#FCEF62",
        color: disabled ? "rgba(255, 255, 255, 0.76)" : "#000",
        padding: "6px 10px",
      }}
    >
      {children}
    </Button>
  );
}

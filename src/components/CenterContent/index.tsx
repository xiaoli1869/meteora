import React from "react";
import { observer } from "mobx-react-lite";

const CenterContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full h-lxl-100vh" style={{ background: "#0E0E0F" }}>
      <div className="w-lxl-1240 m-auto">{children}</div>
    </div>
  );
};
export default observer(CenterContent);

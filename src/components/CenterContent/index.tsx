import React from "react";
import { observer } from "mobx-react-lite";
import Header from "@/components/Header";
const CenterContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full h-lxl-100vh" style={{ background: "#0E0E0F" }}>
      <div className="w-lxl-1240 m-auto">
        <Header />
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 88px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default observer(CenterContent);

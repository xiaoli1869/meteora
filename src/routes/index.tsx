import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SupplyBorrow from "@/views/SupplyBorrow";
import Tab2 from "@/views/Tab2";
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SupplyBorrow />} />
        <Route path="/tab2" element={<Tab2 />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

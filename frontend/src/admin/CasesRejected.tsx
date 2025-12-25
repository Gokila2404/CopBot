import React from "react";
import "./admin.css";

const CasesRejected: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h2>Rejected Cases</h2>
      <p>Cases rejected after review with reasons and dates.</p>
    </div>
  );
};

export default CasesRejected;

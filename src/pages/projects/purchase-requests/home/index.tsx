import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

export const PurchaseRequests: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>PurchaseRequests</p>
    </div>
  );
};

export default PurchaseRequests;

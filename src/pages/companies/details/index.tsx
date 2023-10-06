import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

export const CompanyDetails: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Component</p>
    </div>
  );
};

export default CompanyDetails;

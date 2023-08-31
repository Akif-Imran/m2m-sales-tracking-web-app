import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

const Company: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Company</p>
    </div>
  );
};

export { Company };

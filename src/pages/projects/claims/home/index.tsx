import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

export const Claims: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Claims</p>
    </div>
  );
};

export default Claims;

import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

const _Component: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Component</p>
    </div>
  );
};

export { _Component };

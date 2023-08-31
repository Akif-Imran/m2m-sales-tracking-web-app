import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

const Tasks: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Task</p>
    </div>
  );
};

export { Tasks };

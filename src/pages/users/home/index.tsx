import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

const Users: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Users</p>
    </div>
  );
};

export  {Users};

import React from "react";
import { useStyles } from "./styles";

interface OwnProps {}

const Projects: React.FC<OwnProps> = () => {
  useStyles();
  return (
    <div>
      <p>Projects</p>
    </div>
  );
};

export  {Projects};

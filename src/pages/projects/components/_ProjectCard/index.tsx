import { Card, Text } from "@mantine/core";
import React from "react";
import { selectProjectWithRecords } from "@store";

interface OwnProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  item: ReturnType<typeof selectProjectWithRecords>[0];
  handleDelete: (id: string) => void;
  assignEngineer: (projectId: string) => void;
  updateStatus: (statusId: number, projectId: string) => void;
}

export const _ProjectCard: React.FC<OwnProps> = ({ onClick }) => {
  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"lg"} radius={"md"} onClick={onClick}>
      <Text>_ProjectCard</Text>
    </Card>
  );
};

export default _ProjectCard;

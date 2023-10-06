import { Card, Flex, Text } from "@mantine/core";
import { colors } from "@theme";
import React from "react";
import { BsFillFileEarmarkFill } from "react-icons/bs";
import { IoChevronForward } from "react-icons/io5";
import { useStyles } from "./styles";

interface OwnProps {
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  title: string;
}
const _ReportCard: React.FC<OwnProps> = ({ onClick, title }) => {
  const { classes } = useStyles();

  return (
    <Card shadow="sm" radius="md" p="xs" className={classes.card} onClick={onClick}>
      <Flex direction={"row"} justify={"space-between"} align={"center"}>
        <Flex direction={"row"} align={"center"}>
          <BsFillFileEarmarkFill size={15} color={colors.titleText} />
          <Text ml={"md"} fz={"md"} color={colors.titleText} align="left">
            {title}
          </Text>
        </Flex>
        <IoChevronForward size={15} color={colors.titleText} />
      </Flex>
    </Card>
  );
};

export { _ReportCard };

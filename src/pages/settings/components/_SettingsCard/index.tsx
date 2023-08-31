import React from "react";
import { useStyles } from "./styles";
import { Card, Flex, Text } from "@mantine/core";
import { IconChevronRight, IconSettings } from "@tabler/icons-react";
import { colors } from "../../../../theme";

interface OwnProps {
  title: string;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}
const _SettingsCard: React.FC<OwnProps> = ({ title, onClick }) => {
  const { classes } = useStyles();
  return (
    <Card shadow="sm" radius="md" p="xs" mb={"xs"} className={classes.card} onClick={onClick}>
      <Flex direction={"row"} justify={"space-between"} align={"center"}>
        <Flex direction={"row"} align={"center"}>
          <IconSettings size={22} stroke={1.3} color={colors.titleText} />
          <Text ml={"md"} fz={"md"} color={colors.titleText} align="left">
            {title}
          </Text>
        </Flex>
        <IconChevronRight size={22} stroke={1.3} color={colors.titleText} />
      </Flex>
    </Card>
  );
};

export { _SettingsCard };

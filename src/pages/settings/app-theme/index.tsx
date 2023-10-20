import React from "react";
import { useStyles } from "./styles";
import { Card, Flex, Stack, Text, rem } from "@mantine/core";
import { colors } from "@theme";
import { useThemeColorContext } from "../../../App";
import { IconCheck } from "@tabler/icons-react";

interface OwnProps {}

const AppTheme: React.FC<OwnProps> = () => {
  const { theme } = useStyles();
  const { setColor, color } = useThemeColorContext();
  return (
    <Card radius={"md"} shadow="md" mih={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} m={"xs"} color={colors.titleText}>
          App Theme
        </Text>
        <Flex direction={"row"} wrap={"wrap"} m={"xs"}>
          {Object.entries(theme.colors).map(([key, value]) => (
            <div
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                //@ts-expect-error string assigned to color
                setColor((prev) => {
                  console.log(key);
                  return key;
                });
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginInline: rem(2),
                marginBlock: rem(2),
                borderRadius: theme.radius.xs,
                width: rem(20),
                height: rem(20),
                backgroundColor: value[6],
              }}
            >
              {key === color && <IconCheck size={14} color={colors.white} z={10} stroke={2} />}
            </div>
          ))}
        </Flex>
      </Stack>
    </Card>
  );
};

export default AppTheme;

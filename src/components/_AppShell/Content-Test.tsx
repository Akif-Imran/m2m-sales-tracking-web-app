import React from "react";
import { Button, DefaultProps, packSx, useMantineTheme } from "@mantine/core";

interface ContentProps extends DefaultProps {}


export const ContentTest: React.FC<ContentProps> = ({ sx, ...others }) => {
  const theme = useMantineTheme();
  return (
    <>
      <div className="w-20 h-20" />
      <p className="text-sm">This is Text</p>
      <Button
        sx={[
          {
            color: theme.colors.red[9],
            "&:hover": {
              backgroundColor: "black",
            },
          },
          ...packSx(sx),
        ]}
        {...others}
      >
        My Button
      </Button>
    </>
  );
};

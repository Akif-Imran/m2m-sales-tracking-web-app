import { createStyles, UnstyledButton, Avatar, Text, Flex, rem } from "@mantine/core";
import { setModule } from "@slices";
import { useAppDispatch } from "@store";
import React from "react";

interface OwnProps {}
export const Home: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();

  return (
    <Flex direction={"row"} justify={"space-between"} my={rem(160)} mx={rem(160)}>
      <UnstyledButton onClick={() => dispatch(setModule("crm"))} className={classes.btn}>
        <Flex direction={"column"} align={"center"}>
          <Avatar size={160} color={"blue"} radius={"lg"} className={classes.initials}>
            CRM
          </Avatar>
          <Text size="sm" color="dimmed" mt={"md"}>
            Customer Relationship
          </Text>
          <Text size="sm" color="dimmed">
            Management
          </Text>
        </Flex>
      </UnstyledButton>

      <UnstyledButton onClick={() => dispatch(setModule("project"))} className={classes.btn}>
        <Flex direction={"column"} align={"center"}>
          <Avatar size={160} color={"green"} radius={"lg"} className={classes.initials}>
            PM
          </Avatar>
          <Text size="sm" color="dimmed" mt={"md"}>
            Project
          </Text>
          <Text size="sm" color="dimmed">
            Management
          </Text>
        </Flex>
      </UnstyledButton>

      <UnstyledButton onClick={() => dispatch(setModule("inventory"))} className={classes.btn}>
        <Flex direction={"column"} align={"center"}>
          <Avatar size={160} color={"red"} radius={"lg"} className={classes.initials}>
            IM
          </Avatar>
          <Text size="sm" color="dimmed" mt={"md"}>
            Inventory
          </Text>
          <Text size="sm" color="dimmed">
            Management
          </Text>
        </Flex>
      </UnstyledButton>
    </Flex>
  );
};

export default Home;

const useStyles = createStyles(() => ({
  initials: {
    transition: "all 150ms ease",
    ["&:hover"]: {
      boxShadow: "0 0 11px rgba(33,33,33,.2)",
    },
  },
  btn: {
    transition: "all 150ms ease",
    ["&:hover"]: {
      transform: "scale(1.5)",
    },
  },
}));

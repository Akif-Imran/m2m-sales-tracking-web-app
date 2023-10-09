import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Card,
  Center,
  Flex,
  Grid,
  Loader,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { colors } from "@theme";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { markAsRead } from "@slices";
import { IconSquareRoundedCheck, IconSquareRounded } from "@tabler/icons-react";
import { useAppDispatch } from "@store";

interface OwnProps {}

const Notification: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  const dispatch = useAppDispatch();
  // const {} = useAuthContext();
  // const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [notifications, _setNotifications] = React.useState<INotification[]>([]);
  const [searchedNotifications, setSearchedNotifications] = React.useState<INotification[]>([]);
  const [isFetching, _setIsFetching] = React.useState(false);

  const fetchNotifications = React.useCallback(() => {
    // setIsFetching(true);
  }, []);

  React.useEffect(() => {
    if (!notifications) {
      return;
    }
    setSearchedNotifications(notifications);
  }, [notifications]);

  React.useEffect(() => {
    // addInfo();
    fetchNotifications();
  }, [fetchNotifications]);

  const rows = isFetching ? (
    <Stack>
      <Center>
        <Loader variant="dots" />
      </Center>
    </Stack>
  ) : (
    <React.Fragment>
      {searchedNotifications.length === 0 ? (
        <Stack>
          <Center>
            <Text color={colors.titleText}>No Notifications</Text>
          </Center>
        </Stack>
      ) : (
        <>
          {searchedNotifications.map((notification) => (
            <Card
              shadow="sm"
              mb={"xs"}
              px={"sm"}
              py={"xs"}
              radius={"md"}
              key={notification.id.toString()}
            >
              <Flex direction={"column"}>
                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                  <Text size={"md"}>{notification.title}</Text>
                  <ActionIcon
                    onClick={
                      !notification.isRead ? () => dispatch(markAsRead(notification.id)) : undefined
                    }
                  >
                    {notification.isRead ? (
                      <IconSquareRoundedCheck
                        stroke={1.5}
                        color={theme.colors[theme.primaryColor][6]}
                      />
                    ) : (
                      <IconSquareRounded stroke={1.5} color={theme.colors[theme.primaryColor][6]} />
                    )}
                  </ActionIcon>
                </Flex>
                <Text size={"sm"} c={colors.titleText}>
                  {notification.body}
                </Text>
                <Text className={classes.descText} c={"dark.1"}>
                  {DateTime.fromISO(notification.createdAt).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
                </Text>
              </Flex>
            </Card>
          ))}
        </>
      )}
    </React.Fragment>
  );

  return (
    <Grid>
      <Grid.Col span={4}>
        <ScrollArea>{rows}</ScrollArea>
      </Grid.Col>
    </Grid>
  );
};

export default Notification;

import React from "react";
import { useStyles } from "./styles";
import {
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Loader,
  ScrollArea,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { colors } from "@theme";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";

interface OwnProps {}

const Notification: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
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
            <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"} key={notification._id}>
              <Stack spacing={"xs"}>
                <Text className={classes.headerText} fz={rem(24)}>
                  {notification.title}
                </Text>
                <Divider />
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>IMEI</Text>
                  <Text className={classes.descText}>{notification.IMEI || "N/A"}</Text>
                </Flex>
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>Date/Time</Text>
                  <Text className={classes.descText}>
                    {DateTime.fromISO(notification.createdAt, { zone: "utc" }).toFormat(
                      DAY_MM_DD_YYYY_HH_MM_SS_A
                    ) || "N/A"}
                  </Text>
                </Flex>
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>Description</Text>
                  <Text className={classes.descText}>{notification.body || "N/A"}</Text>
                </Flex>
              </Stack>
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

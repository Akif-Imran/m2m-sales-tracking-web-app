import React from "react";
import { useStyles } from "./styles";
import { useAuthContext } from "@contexts";
import { getDashCounts } from "@services";
import { colors } from "@theme";
import { notify } from "@utility";
import { Card, Flex, Grid, Select, Text, rem } from "@mantine/core";
import { Chart, GoogleChartOptions } from "react-google-charts";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY } from "@constants";

interface OwnProps {}
interface ChartData {
  data: (string | number)[][];
  total: number;
}

const Dashboard: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  // const [isFetching, setIsFetching] = React.useState(false);
  const [forkliftCounts, setForkliftCounts] = React.useState<ChartData>();
  const [driverCounts, setDriverCounts] = React.useState<ChartData>();
  const [alarms, setAlarms] = React.useState<ChartData>();
  const [line, setLine] = React.useState<ChartData>();
  const [collisionLine, setCollisionLine] = React.useState<ChartData>();
  const [driverActivityLine, setDriverActivityLine] = React.useState<ChartData>();
  const [mostRepeatedAlarm, setMostRepeatedAlarm] = React.useState<ChartData>();
  const [mostRepeatedMaintenance, setMostRepeatedMaintenance] = React.useState<ChartData>();
  const [mostMileage, setMostMileage] = React.useState<ChartData>();

  const options: GoogleChartOptions = {
    title: "",
    is3D: false,
    height: 300,
    pieHole: 0.25,
    backgroundColor: colors.white,
    curveType: "function",
    sliceVisibilityThreshold: 0,
    pieSliceTextStyle: {
      color: colors.white,
    },
    vAxis: {
      titleTextStyle: {
        color: colors.titleText,
      },
      textStyle: {
        color: colors.titleText,
      },
    },
    hAxis: {
      titleTextStyle: {
        color: colors.titleText,
      },
      textStyle: {
        color: colors.titleText,
      },
    },
    titleTextStyle: {
      color: colors.titleText,
      fontSize: 18,
    },
    chartArea: {
      width: "100%",
      height: "80%",
      left: theme.spacing.md,
      right: theme.spacing.md,
    },
    fontSize: 16,
    colors: [
      theme.colors.green[5],
      theme.colors.cyan[5],
      theme.colors.indigo[5],
      theme.colors.red[5],
      theme.colors.blue[5],
      theme.colors.yellow[5],
      theme.colors.violet[5],
      theme.colors.grape[5],
      theme.colors.teal[5],
    ],
    legend: {
      textStyle: {
        color: colors.titleText,
        fontSize: 14,
      },
    },
    tooltip: {
      textStyle: {
        color: colors.titleText,
        fontSize: 16,
      },
    },
  };

  const fetchDashCounts = React.useCallback(() => {
    getDashCounts(token)
      .then((res) => {
        if (res.success) {
          const {
            moving,
            parked,
            total_vehicles,
            driver_available,
            driver_unavailable,
            total_driver,
          } = res.data;
          const reporting = Math.abs(parked + moving);
          const not_reporting = Math.abs(total_vehicles - reporting);
          const vehicleLegends = [
            ["Vehicle Status", "Counts"],
            [`Moving (${moving || 0})`, moving || 0],
            [`Parked (${parked || 0})`, parked || 0],
            [`Reporting (${reporting || 0})`, reporting || 0],
            [`Not Reporting (${not_reporting || 0})`, not_reporting || 0],
          ];
          setForkliftCounts({
            data: vehicleLegends,
            total: total_vehicles,
          });
          //------driver counts------
          const unavailable = driver_unavailable < 0 ? 0 : driver_unavailable;
          const driverLegends = [
            ["Driver Status", "Counts"],
            [`Available (${driver_available || 0})`, driver_available],
            [`Unavailable (${unavailable || 0})`, unavailable],
          ];
          setDriverCounts({
            data: driverLegends,
            total: total_driver,
          });
        }
      })
      .catch((err) => {
        notify("Dash Counts", "An error occurred", "error");
        console.log(err?.message);
      });
  }, [token]);

  React.useEffect(() => {
    fetchDashCounts();
  }, [fetchDashCounts]);

  React.useEffect(() => {
    const alarmsData = [
      ["Month", "MOTOR_ALERT", "COLLISION_ALERT", "OVER_SPEEDING_ALERT"],
      ["May", 47, 43, 56],
      ["June", 84, 23, 12],
      ["July", 12, 4, 75],
      ["Aug", 45, 36, 34],
    ];
    setAlarms((_prev) => ({ data: alarmsData, total: 0 }));

    const lineData = [
      ["Day", "PT-01", "PT-02", "PT-03"],
      [1, 37.8, 80.8, 41.8],
      [2, 30.9, 69.5, 32.4],
      [3, 25.4, 57, 25.7],
      [4, 11.7, 18.8, 10.5],
      [5, 11.9, 17.6, 10.4],
      [6, 8.8, 13.6, 7.7],
      [7, 7.6, 12.3, 9.6],
      [8, 12.3, 29.2, 10.6],
      [9, 16.9, 42.9, 14.8],
      [10, 12.8, 30.9, 11.6],
    ];
    setLine((_prev) => ({ data: lineData, total: 0 }));
  }, []);

  React.useEffect(() => {
    const currentDate = DateTime.local();
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = currentDate.minus({ days: i });
      last7Days.push(date.toFormat(DAY_MM_DD_YYYY));
    }
    const collisionData = [
      ["Day", "PT-01", "PT-02", "PT-03", "PT-04", "PT-05", "PT-06", "PT-07"],
      [last7Days[0], 37.8, 80.8, 41.8, 12.8, 30.9, 11.6, 45.2],
      [last7Days[1], 30.9, 69.5, 32.4, 16.9, 42.9, 14.8, 32],
      [last7Days[2], 25.4, 57, 25.7, 12.3, 29.2, 10.6, 89],
      [last7Days[3], 11.7, 18.8, 10.5, 7.6, 12.3, 9.6, 23],
      [last7Days[4], 11.9, 17.6, 10.4, 8.8, 13.6, 7.7, 56],
      [last7Days[5], 8.8, 13.6, 7.7, 11.9, 17.6, 10.4, 87],
      [last7Days[6], 7.6, 12.3, 9.6, 11.7, 18.8, 10.5, 90],
      // [8, 12.3, 29.2, 10.6, 25.4, 57, 25.7, 12],
      // [9, 16.9, 42.9, 14.8, 30.9, 69.5, 32.4, 23],
      // [10, 12.8, 30.9, 11.6, 37.8, 80.8, 41.8, 45],
    ];
    setCollisionLine((_prev) => ({ data: collisionData, total: 58 }));
  }, []);

  React.useEffect(() => {
    const currentDate = DateTime.local();
    const last7Days = [];
    for (let i = 0; i < 3; i++) {
      const date = currentDate.minus({ days: i });
      last7Days.push(date.toFormat(DAY_MM_DD_YYYY));
    }
    const driverActivity = [
      ["Day", "Driver-01", "Driver-02", "Driver-03"],
      [last7Days[0], 37.8, 80.8, 41.8],
      [last7Days[1], 30.9, 69.5, 32.4],
      [last7Days[2], 25.4, 57, 25.7],
      // [last7Days[3], 11.7, 18.8, 10.5],
      // [last7Days[4], 11.9, 17.6, 10.4],
      // [last7Days[5], 8.8, 13.6, 7.7],
      // [last7Days[6], 7.6, 12.3, 9.6],
    ];
    setDriverActivityLine((_prev) => ({ data: driverActivity, total: 77 }));
  }, []);

  React.useEffect(() => {
    const currentDate = DateTime.local();
    const last7Days = [];
    for (let i = 0; i < 3; i++) {
      const date = currentDate.minus({ days: i });
      last7Days.push(date.toFormat(DAY_MM_DD_YYYY));
    }
    const repeatedAlarm = [
      ["Alarm", "Counts"],
      ["COLLISION_ALARM", 38],
      ["MOTOR_ALARM", 31],
      ["SERVO", 26],
      // [last7Days[3], 11.7, 18.8, 10.5],
      // [last7Days[4], 11.9, 17.6, 10.4],
      // [last7Days[5], 8.8, 13.6, 7.7],
      // [last7Days[6], 7.6, 12.3, 9.6],
    ];
    setMostRepeatedAlarm((_prev) => ({ data: repeatedAlarm, total: 95 }));
  }, []);

  React.useEffect(() => {
    const currentDate = DateTime.local();
    const last7Days = [];
    for (let i = 0; i < 3; i++) {
      const date = currentDate.minus({ days: i });
      last7Days.push(date.toFormat(DAY_MM_DD_YYYY));
    }
    const repeatedMaintenance = [
      ["Maintenance", "Counts"],
      ["Tire Breakdown", 11],
      ["Engine Breakdown", 9],
      ["Oil Change", 3],
      // [last7Days[3], 11.7, 18.8, 10.5],
      // [last7Days[4], 11.9, 17.6, 10.4],
      // [last7Days[5], 8.8, 13.6, 7.7],
      // [last7Days[6], 7.6, 12.3, 9.6],
    ];
    setMostRepeatedMaintenance((_prev) => ({ data: repeatedMaintenance, total: 23 }));
  }, []);

  React.useEffect(() => {
    const mostMileage = [
      ["Vehicle", "Miles"],
      [`PT-01 (${56})`, 56],
      [`PT-02 (${48})`, 48],
      [`PT-03 (${32})`, 32],
      [`PT-04 (${26})`, 26],
      [`PT-05 (${19})`, 19],
    ];
    setMostMileage((_prev) => ({ data: mostMileage, total: 181 }));
  }, []);

  return (
    <Grid>
      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {forkliftCounts?.total || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Fleet Utilization
          </Text>
          <Chart chartType="Line" width="100%" height="50%" data={line?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {driverActivityLine?.total || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Driver Activity
          </Text>
          <Chart
            chartType="Line"
            width="100%"
            height="50%"
            data={driverActivityLine?.data}
            options={options}
          />
        </Card>
      </Grid.Col>

      <Grid.Col md={12} lg={12} xl={12}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {collisionLine?.total || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Collisions (Last 7 Days)
          </Text>
          <Chart
            chartType="Line"
            width="100%"
            height="50%"
            data={collisionLine?.data}
            options={options}
          />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {forkliftCounts?.total || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Fleet Status
          </Text>
          <Chart chartType="PieChart" data={forkliftCounts?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {driverCounts?.total || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Drivers
          </Text>
          <Chart chartType="PieChart" data={driverCounts?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p={"xs"} shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
            {0 || 0}
          </Text>
          <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
            Top 3 Received Alarm (Monthly)
          </Text>
          <Chart chartType="Bar" width="100%" height="50%" data={alarms?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Flex direction={"row"} justify={"space-between"}>
            <Flex direction={"column"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {mostRepeatedAlarm?.total || 0}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Most Received Alarm
              </Text>
            </Flex>
            <Select
              size="xs"
              placeholder="Pick one"
              data={[
                { value: "today", label: "Today" },
                { value: "month", label: "This Month" },
                { value: "90", label: "Last 90 Days" },
              ]}
              defaultValue={"today"}
            />
          </Flex>
          <Chart chartType="PieChart" data={mostRepeatedAlarm?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Flex direction={"row"} justify={"space-between"}>
            <Flex direction={"column"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {mostRepeatedMaintenance?.total || 0}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Most Received Maintenance
              </Text>
            </Flex>
            <Select
              size="xs"
              placeholder="Pick one"
              data={[
                { value: "today", label: "Today" },
                { value: "month", label: "This Month" },
                { value: "90", label: "Last 90 Days" },
              ]}
              defaultValue={"today"}
            />
          </Flex>
          <Chart chartType="PieChart" data={mostRepeatedMaintenance?.data} options={options} />
        </Card>
      </Grid.Col>

      <Grid.Col md={6} lg={6} xl={6}>
        <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
          <Flex direction={"row"} justify={"space-between"}>
            <Flex direction={"column"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {mostMileage?.total || 0}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Most Mileage
              </Text>
            </Flex>
            <Select
              size="xs"
              placeholder="Pick one"
              data={[
                { value: "today", label: "Today" },
                { value: "month", label: "This Month" },
                { value: "90", label: "Last 90 Days" },
              ]}
              defaultValue={"today"}
            />
          </Flex>
          <Chart chartType="PieChart" data={mostMileage?.data} options={options} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export { Dashboard };

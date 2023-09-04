import React, { useState } from "react";
import { useStyles } from "./styles";
import { colors } from "@theme";
import {
  Button,
  Card,
  Flex,
  Grid,
  Loader,
  ScrollArea,
  Select,
  Table,
  Tabs,
  Text,
  rem,
} from "@mantine/core";
import { Chart, GoogleChartOptions } from "react-google-charts";
import { IconCalendar, IconGraph } from "@tabler/icons-react";
import { useToggle } from "@mantine/hooks";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { selectTasksCombined, useAppSelector } from "@store";

interface OwnProps {}
interface ChartData {
  data: (string | number)[][];
  total: number;
}

const Dashboard: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  // const [isFetching, setIsFetching] = React.useState(false);
  const { tasks } = useAppSelector(selectTasksCombined);
  const [calendarLoading, setIsCalendarLoading] = React.useState<boolean>(false);
  const [projectCounts, setProjectsCounts] = React.useState<ChartData>();
  const [projectValueCounts, setProjectValueCounts] = React.useState<ChartData>();
  const [projectTargetCounts, setProjectTargetCounts] = React.useState<ChartData>();
  const [projectValueTargetCounts, setProjectValueTargetCounts] = React.useState<ChartData>();
  const [projectOverDue, _setProjectOverDue] = useState([
    { name: "HYCO", dueDate: "2023-08-23T15:00:00.000Z" },
    { name: "HIKKO", dueDate: "2023-09-01T12:00:00.000Z" },
  ]);
  const [pendingTasks, _setPendingTasks] = useState([
    { name: "Jason", task: "Repair AAV", dueDate: "2023-08-22T20:00:00.000Z" },
  ]);
  const [value, toggle] = useToggle(["by value", "by project"]);

  const options: GoogleChartOptions = {
    title: "",
    is3D: false,
    height: 300,
    pieHole: 0.25,
    backgroundColor: colors.white,
    curveType: "function",
    sliceVisibilityThreshold: 0,
    animation: {
      duration: 1000,
      easing: "out",
      startup: true,
    },
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

  console.log(tasks);

  const drawProjectCharts = React.useCallback(() => {
    const projectsLegends = [
      ["Vehicle Status", "Counts"],
      [`Quotation (${47})`, 47],
      [`Follow Up (${376})`, 376],
      [`Completed (${200})`, 200],
      [`In Development (${13})`, 13],
    ];
    setProjectsCounts({
      data: projectsLegends,
      total: 636,
    });
    //------driver counts------
    const valueLegends = [
      ["Project", "Value"],
      [`RM (${6000}) Quotation`, 6000],
      [`RM (${24000}) Completed`, 24000],
      [`RM (${98000}) In Development`, 98000],
    ];
    setProjectValueCounts({
      data: valueLegends,
      total: 128000,
    });
  }, []);

  React.useEffect(() => {
    // const targetChart = [
    //   ["Genre", "Fantasy & Sci Fi", { role: "annotation" }],
    //   ["2023", 10, 24, ""],
    //   ["2020", 16, 22, ""],
    //   ["2030", 28, 19, ""],
    // ];
    const targetChart = [
      ["Year", "Projects", "Target"],
      ["Jan", 1000, 400],
      ["Feb", 1170, 460],
      ["March", 660, 1120],
      ["April", 1030, 540],
      ["May", 345, 734],
      ["June", 453, 986],
      ["July", 234, 456],
      ["August", 235, 965],
    ];
    const valueTargetChart = [
      ["Year", "Value", "Target"],
      ["Jan", 2400, 12000],
      ["Feb", 3600, 12000],
      ["March", 4800, 12000],
      ["April", 5600, 12000],
      ["May", 9800, 12000],
      ["June", 13400, 12000],
      ["July", 15000, 24000],
      ["August", 18000, 12000],
    ];
    setProjectTargetCounts({
      data: targetChart,
      total: 0,
    });
    setProjectValueTargetCounts({
      data: valueTargetChart,
      total: 0,
    });
  }, []);

  React.useEffect(() => {
    drawProjectCharts();
  }, [drawProjectCharts]);

  const projectOverdueRows = projectOverDue.map((project, index) => {
    const dueDate = DateTime.fromISO(project.dueDate).toLocal();
    const dueDateSt = dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A);
    const overDueDuration = DateTime.now().diff(dueDate).as("days");
    return (
      <tr key={index}>
        <td>{project.name}</td>
        <td>{dueDateSt}</td>
        <td>{overDueDuration.toFixed(1)} Days</td>
      </tr>
    );
  });

  const pendingTaskRows = pendingTasks.map((task, index) => {
    const dueDate = DateTime.fromISO(task.dueDate).toLocal();
    const dueDateSt = dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A);
    const overDueDuration = DateTime.now().diff(dueDate).as("days");
    return (
      <tr key={index}>
        <td>{task.name}</td>
        <td>{task.task}</td>
        <td>{dueDateSt}</td>
        <td>{overDueDuration.toFixed(1)} Days</td>
      </tr>
    );
  });

  return (
    <Tabs defaultValue="analytics">
      <Tabs.List>
        <Tabs.Tab value="analytics" icon={<IconGraph size={16} />}>
          Analytics
        </Tabs.Tab>
        <Tabs.Tab value="calendar" icon={<IconCalendar size={16} />}>
          Calendar
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="analytics" pt={"sm"}>
        <Grid>
          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {248}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Companies
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {897}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Contacts
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {200}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Projects Completed
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {87}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Tasks
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {projectCounts?.total || 0}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Projects
              </Text>
              <Chart chartType="PieChart" data={projectCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {projectValueCounts?.total || 0}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Value
              </Text>
              <Chart chartType="PieChart" data={projectValueCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card
              p="xs"
              pt={"lg"}
              shadow="sm"
              className={classes.card}
              my={4}
              px={"xs"}
              radius={"md"}
            >
              <Text fz="md" className={classes.label} color={colors.titleText} mb={2}>
                Monthly Project Chart ({value === "by value" ? "By Value" : "By Project"})
              </Text>
              <Flex direction={"row"} gap={"xs"} align={"center"} justify={"flex-end"}>
                <Button variant="filled" size="xs" onClick={() => toggle()}>
                  {value.toUpperCase()}
                </Button>
                <Select
                  w={rem(90)}
                  size="xs"
                  data={[{ value: "2023", label: "2023" }]}
                  defaultValue={"2023"}
                  withinPortal
                />
              </Flex>
              <Chart
                chartType="ColumnChart"
                data={
                  value === "by value" ? projectValueTargetCounts?.data : projectTargetCounts?.data
                }
                options={{ ...options, isStacked: true }}
              />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                {projectOverDue.length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Projects behind timeline
              </Text>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Due Date</th>
                      <th>Delay (Days)</th>
                    </tr>
                  </thead>
                  <tbody>{projectOverdueRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                {pendingTasks.length}
              </Text>
              <Text
                fz="md"
                className={classes.label}
                color={colors.titleText}
                mt={-10}
                mb={2}
                ml={rem(8)}
              >
                Pending Tasks
              </Text>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Task</th>
                      <th>Expected Date</th>
                      <th>Delay (Days)</th>
                    </tr>
                  </thead>
                  <tbody>{pendingTaskRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="calendar" pt={"sm"}>
        {calendarLoading ? (
          <Loader />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin]}
            height={"80vh"}
            contentHeight={"auto"}
            initialView="dayGridMonth"
            loading={(loading) => setIsCalendarLoading(loading)}
            events={tasks.map((task) => ({
              title: task.title,
              start: task.createdDate,
              end: task.plannedEndDate,
              backgroundColor: theme.colors[theme.primaryColor][6],
              borderColor: theme.colors[theme.primaryColor][6],
            }))}
          />
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export { Dashboard };

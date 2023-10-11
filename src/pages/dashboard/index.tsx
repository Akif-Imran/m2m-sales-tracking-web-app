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

import {
  selectFollowUpsWithRecords,
  selectProjectWithRecords,
  selectTasksCombined,
  useAppSelector,
} from "@store";

interface OwnProps {}
interface ChartData {
  data: (string | number)[][];
  total: number;
}

const Dashboard: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  // const [isFetching, setIsFetching] = React.useState(false);
  const { tasks } = useAppSelector(selectTasksCombined);
  const followUps = useAppSelector(selectFollowUpsWithRecords);
  const projects = useAppSelector(selectProjectWithRecords);
  const [calendarLoading, setIsCalendarLoading] = React.useState<boolean>(true);
  const [projectCounts, setProjectsCounts] = React.useState<ChartData>();
  const [projectValueCounts, setProjectValueCounts] = React.useState<ChartData>();
  const [projectTargetCounts, setProjectTargetCounts] = React.useState<ChartData>();
  const [projectValueTargetCounts, setProjectValueTargetCounts] = React.useState<ChartData>();
  const [calendarTasks, setCalendarTasks] = React.useState<ICalendarEvent[]>([]);
  const [projectsInProcess, setProjectInProcess] = useState<
    { name: string; dueDate: string; timeRemaining: string }[]
  >([]);
  const [projectsWithMostClaims, _setProjectsWithMostClaims] = React.useState([
    { name: "Project 1", claims: 8, totalCost: { amount: 18000, currency: "MYR" } },
  ]);
  const [mostFollowedUpLeadWithExpenses, _setMostFollowedUpLeadWithExpenses] = useState([
    { name: "Project 1", followUpCount: 8, expenses: { amount: 15000, currency: "MYR" } },
  ]);
  const [projectOverDue, _setProjectOverDue] = useState([
    { name: "HYCO", dueDate: "2023-08-23T15:00:00.000Z" },
    { name: "HIKKO", dueDate: "2023-09-01T12:00:00.000Z" },
  ]);
  const [pendingTasks, _setPendingTasks] = useState([
    { name: "Jason", task: "Repair AAV", dueDate: "2023-08-22T20:00:00.000Z" },
  ]);
  const [todayActivities, _setTodayActivities] = useState([
    { name: "Repair AAV (2F)", type: "Task", dueDate: DateTime.now().plus({ hours: 1.5 }) },
    { name: "Meet Json Brow", type: "Follow Up", dueDate: DateTime.now().plus({ hours: 3.5 }) },
  ]);
  const [upcomingTasks, _setUpcomingTasks] = useState([
    {
      name: "Alice Smith",
      task: "Meeting with ABC's CTO",
      dueDate: DateTime.now().plus({ days: 2 }),
    },
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

  React.useEffect(() => {
    const inProcess = projects
      .filter((project) => project.statusId === 3)
      .map((project) => {
        const delivery = DateTime.fromISO(project.deliveryDate);
        const remainingDays = delivery.diff(DateTime.now()).as("days");
        return {
          name: project.name,
          dueDate: delivery.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A),
          timeRemaining: `${remainingDays} days`,
        };
      });
    setProjectInProcess(inProcess);
  }, [projects]);

  React.useEffect(() => {
    const tsk = tasks.map((task) => ({
      title: task.title,
      start: task.createdDate,
      end: task.plannedEndDate,
      backgroundColor: theme.colors[theme.primaryColor][6],
      borderColor: theme.colors[theme.primaryColor][6],
    }));

    const follows = followUps.map((followUp) => ({
      title: `Meeting: ${followUp.contactPerson?.name || ""}`,
      start: followUp.nextFollowUp.meetingDate,
      end: followUp.nextFollowUp.meetingDate,
      allDay: true,
      backgroundColor: theme.colors[theme.primaryColor][6],
      borderColor: theme.colors[theme.primaryColor][6],
    }));
    setCalendarTasks(tsk.concat(follows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, followUps]);

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

  const upcomingTaskRows = upcomingTasks.map((task, index) => {
    const dueDateSt = task.dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A);
    return (
      <tr key={index}>
        <td>{task.name}</td>
        <td>{task.task}</td>
        <td>{dueDateSt}</td>
      </tr>
    );
  });

  const mostFollowedUpLeadRows = mostFollowedUpLeadWithExpenses.map((lead, index) => {
    const value = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: lead.expenses.currency,
      maximumFractionDigits: 2,
    }).format(lead.expenses.amount);
    return (
      <tr key={index}>
        <td>{lead.name}</td>
        <td>{lead.followUpCount}</td>
        <td>{value}</td>
      </tr>
    );
  });

  const todayActivitiesRows = todayActivities.map((task, index) => {
    const dueDateSt = task.dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A);
    return (
      <tr key={index}>
        <td>{task.name}</td>
        <td>{task.type}</td>
        <td>{dueDateSt}</td>
      </tr>
    );
  });

  const projectsInProcessRows = projectsInProcess.map((project, index) => {
    return (
      <tr key={index}>
        <td>{project.name}</td>
        <td>{project.dueDate}</td>
        <td>{project.timeRemaining}</td>
      </tr>
    );
  });

  const projectsWithMostClaimsRows = projectsWithMostClaims.map((project, index) => {
    const value = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: project.totalCost.currency,
      maximumFractionDigits: 2,
    }).format(project.totalCost.amount);
    return (
      <tr key={index}>
        <td>{project.name}</td>
        <td>{project.claims}</td>
        <td>{value}</td>
      </tr>
    );
  });

  return (
    <Tabs
      defaultValue="analytics"
      onTabChange={(value) => {
        if (value === "calendar") {
          setTimeout(() => setIsCalendarLoading(false), 200);
        }
      }}
    >
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
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {todayActivitiesRows.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Today's Activities
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Activity Type</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>{todayActivitiesRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {projectsInProcess.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Projects Under Development
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Due Date</th>
                      <th>Time Remaining (Days)</th>
                    </tr>
                  </thead>
                  <tbody>{projectsInProcessRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {mostFollowedUpLeadRows.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Most followed up leads with expenses
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>follow ups</th>
                      <th>Expenses</th>
                    </tr>
                  </thead>
                  <tbody>{mostFollowedUpLeadRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fz="md" className={classes.label} color={colors.titleText} mb={2} pt={"sm"}>
                  Monthly Project Chart ({value === "by value" ? "By Value" : "By Project"})
                </Text>
                <Flex direction={"row"} gap={"xs"} align={"center"} justify={"flex-end"}>
                  <Button variant="filled" size="xs" onClick={() => toggle()}>
                    {value.toUpperCase()}
                  </Button>
                  <Select
                    w={rem(128)}
                    size="xs"
                    data={[{ label: "2023", value: "2023" }]}
                    defaultValue={"2023"}
                    withinPortal
                  />
                </Flex>
              </div>
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
            <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                  {projectCounts?.total || 0}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Projects
                </Text>
              </div>
              <Chart chartType="PieChart" data={projectCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                  {projectValueCounts?.total || 0}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Value
                </Text>
              </div>
              <Chart chartType="PieChart" data={projectValueCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {projectOverDue.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Projects behind timeline
                </Text>
              </div>
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
              <div className={classes.grayContainer}>
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
              </div>
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

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {upcomingTaskRows.length}
                </Text>
                <Text
                  fz="md"
                  className={classes.label}
                  color={colors.titleText}
                  mt={-10}
                  mb={2}
                  ml={rem(8)}
                >
                  Upcoming Tasks (Next 2 Days)
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Task</th>
                      <th>Expected Date</th>
                    </tr>
                  </thead>
                  <tbody>{upcomingTaskRows}</tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {projectsWithMostClaims.length}
                </Text>
                <Text
                  fz="md"
                  className={classes.label}
                  color={colors.titleText}
                  mt={-10}
                  mb={2}
                  ml={rem(8)}
                >
                  Projects with most claims
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>No. of Claims</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>{projectsWithMostClaimsRows}</tbody>
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
            events={calendarTasks}
          />
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export { Dashboard };

interface ICalendarEvent {
  title?: string;
  start?: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  allDay?: boolean;
}

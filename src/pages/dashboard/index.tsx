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
import { DAY_MM_DD_YYYY, DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import {
  selectCompanies,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectProjectStatusList,
  selectProjectWithRecords,
  selectTasksCombined,
  useAppSelector,
} from "@store";
import { apiGet, urls } from "@api";
import { useAuthContext } from "@contexts";

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
  const { tasks } = useAppSelector(selectTasksCombined);
  const followUps = useAppSelector(selectFollowUpsWithRecords);
  const projects = useAppSelector(selectProjectWithRecords);
  const { data: projectStatusList } = useAppSelector(selectProjectStatusList);
  const { data: companies } = useAppSelector(selectCompanies);
  const { data: contacts } = useAppSelector(selectCompanyContact);
  const [calendarLoading, setIsCalendarLoading] = React.useState<boolean>(true);
  const [projectCounts, setProjectsCounts] = React.useState<ChartData>();
  const [projectValueCounts, setProjectValueCounts] = React.useState<ChartData>();
  const [projectTargetCounts, setProjectTargetCounts] = React.useState<ChartData>();
  const [projectValueTargetCounts, setProjectValueTargetCounts] = React.useState<ChartData>();
  const [calendarTasks, setCalendarTasks] = React.useState<ICalendarEvent[]>([]);

  const [projectsUnderDev, setProjectsUnderDev] = useState<
    { name: string; dueDate: string; timeRemaining: string }[]
  >([]);

  const [projectsWithMostClaims, setProjectsWithMostClaims] = React.useState<
    { project: string; claimsCount: number }[]
  >([]);

  const [mostFollowedUpLeadWithExpenses, setMostFollowedUpLeadWithExpenses] = useState<
    {
      name: string;
      followUpCount: number;
      expenses: {
        amount: number;
        currency: string;
      };
    }[]
  >([{ name: "Project 1", followUpCount: 8, expenses: { amount: 15000, currency: "MYR" } }]);

  const [projectOverDue, setProjectOverDue] = useState<
    { name: string; dueDate: string; delay: number }[]
  >([]);

  const [pendingTasks, setPendingTasks] = useState<
    { name: string; taskTitle: string; dueDate: string }[]
  >([]);

  const [todayActivities, setTodayActivities] = useState<
    { name: string; type: "Task" | "Follow Up"; dueDate: string }[]
  >([]);

  const [upcomingTasks, setUpcomingTasks] = useState<
    { name: string; taskTitle: string; dueDate: string }[]
  >([]);

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
    const projectsLegends: (string | number)[][] = [
      ["Vehicle Status", "Counts"],
      // [`Quotation (${47})`, 47], // example of data
    ];
    const valueLegends: (string | number)[][] = [
      ["Project", "Value"],
      // [`RM (${6000}) Quotation`, 6000],// example of data
    ];
    let totalValue = 0;
    projectStatusList.forEach((value) => {
      const counts = projects.filter((project) => project.status === value.id);
      const cateValue = counts.reduce((acc, cur) => acc + cur.value.amount, 0);

      totalValue += cateValue;
      const convertedValue = Intl.NumberFormat("en-US", {
        currency: "MYR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        style: "currency",
      }).format(cateValue);

      valueLegends.push([`${value.name} (${convertedValue})`, cateValue]);
      projectsLegends.push([`${value.name} (${counts.length})`, counts.length]);
    });
    //------driver counts------
    setProjectValueCounts({
      data: valueLegends,
      total: totalValue,
    });
    setProjectsCounts({
      data: projectsLegends,
      total: projects.length,
    });
  }, [projectStatusList, projects]);

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
      .filter((project) => project.status >= 4 && project.status < 6)
      .map((project) => {
        const delivery = DateTime.fromISO(project.deliveryDate);
        const remainingDays = delivery.diff(DateTime.now()).as("days");
        return {
          name: project.name,
          dueDate: delivery.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A),
          timeRemaining: `${remainingDays.toFixed(2)} days`,
        };
      });
    setProjectsUnderDev(inProcess);
  }, [projects]);

  React.useEffect(() => {
    const overDueProjects = projects
      .filter((project) => {
        const delay = DateTime.now().diff(DateTime.fromISO(project.deliveryDate)).as("days");
        return project.status !== 6 && delay > 0;
      })
      .map((overDue) => ({
        name: overDue.name,
        dueDate: overDue.deliveryDate,
        delay: DateTime.now().diff(DateTime.fromISO(overDue.deliveryDate)).as("days"),
      }));
    setProjectOverDue(overDueProjects);
  }, [projects]);

  React.useEffect(() => {
    const overDueTasks = tasks
      .filter((task) => {
        const delay = DateTime.now().diff(DateTime.fromISO(task.completionDeadline)).as("days");
        return delay > 0 && task.status !== 3;
      })
      .map((task) => ({
        name: task.assignee?.name || "N/A",
        taskTitle: task.title,
        dueDate: task.completionDeadline,
      }));
    setPendingTasks(overDueTasks);

    const next2DayTask = tasks
      .filter((task) => {
        const difference = DateTime.fromISO(task.completionDeadline)
          .diff(DateTime.now())
          .as("days");
        return difference > 0 && difference <= 2;
      })
      .map((task) => ({
        name: task.assignee?.name || "N/A",
        taskTitle: task.title,
        dueDate: task.completionDeadline,
      }));

    setUpcomingTasks(next2DayTask);
  }, [tasks]);

  React.useEffect(() => {
    const tsk = tasks.map((task) => ({
      title: task.title,
      start: task.createdAt,
      end: task.completionDeadline,
      backgroundColor: theme.colors[theme.primaryColor][6],
      borderColor: theme.colors[theme.primaryColor][6],
    }));

    const follows = followUps.map((followUp) => ({
      title: `Meeting: ${followUp.contactPerson?.name || ""}`,
      start: followUp.nextMeetingDate,
      end: followUp.nextMeetingDate,
      allDay: true,
      backgroundColor: theme.colors[theme.primaryColor][6],
      borderColor: theme.colors[theme.primaryColor][6],
    }));
    //@ts-expect-error the type works
    setCalendarTasks(tsk.concat(follows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, followUps]);

  React.useEffect(() => {
    if (!token) return;
    apiGet<ApiResponse<{ project: string; claimsCount: number }[]>>(
      urls.claims.getHighestProjectClaims,
      token
    ).then((res) => {
      if (res.data.success) {
        setProjectsWithMostClaims(res.data.data);
      }
    });
  }, [token]);

  React.useEffect(() => {
    // { name: "Repair AAV (2F)", type: "Task", dueDate: DateTime.now().plus({ hours: 1.5 }) },
    // { name: "Meet Json Brow", type: "Follow Up", dueDate: DateTime.now().plus({ hours: 3.5 }) },
    const records: {
      name: string;
      type: "Task" | "Follow Up";
      dueDate: string;
    }[] = [];

    tasks.forEach((task) => {
      const today = DateTime.local();
      const dueDate = DateTime.fromISO(task.completionDeadline);
      const isSameYear = dueDate.hasSame(today, "year");
      const isSameMonth = dueDate.hasSame(today, "month");
      const isSameDay = dueDate.hasSame(today, "day");
      if (isSameDay && isSameMonth && isSameYear) {
        records.push({
          name: task.title,
          type: "Task",
          dueDate: dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A),
        });
      }
    });

    followUps.forEach((followup) => {
      const today = DateTime.local();
      const dueDate = DateTime.fromISO(followup.meetingDate);
      const isSameYear = dueDate.hasSame(today, "year");
      const isSameMonth = dueDate.hasSame(today, "month");
      const isSameDay = dueDate.hasSame(today, "day");
      if (isSameDay && isSameMonth && isSameYear) {
        records.push({
          name: `Meet ${followup.followUpPerson?.name}`,
          type: "Follow Up",
          dueDate: dueDate.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A),
        });
      }
    });

    setTodayActivities(records);
  }, [tasks, followUps]);

  React.useEffect(() => {
    const mostFollowedLeadsWithExpense = projects
      .filter((project) => project.status !== 6)
      .map((project) => {
        let expense = 0,
          count = 0;
        followUps
          .filter((follow) => follow.projectId === project._id)
          .forEach((follow) => {
            count += 1;
            expense += follow.expensePrice?.amount || 0;
          });
        return {
          name: project.name,
          followUpCount: count,
          expenses: {
            amount: expense,
            currency: "MYR",
          },
        };
      })
      .filter((lead) => lead.followUpCount > 0)
      .sort((a, b) => b.followUpCount - a.followUpCount);
    setMostFollowedUpLeadWithExpenses(mostFollowedLeadsWithExpense);
  }, [projects, followUps]);

  const projectOverdueRows = projectOverDue.map((project, index) => {
    const dueDate = DateTime.fromISO(project.dueDate).toLocal();
    const dueDateSt = dueDate.toFormat(DAY_MM_DD_YYYY);
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
        <td>{task.taskTitle}</td>
        <td>{dueDateSt}</td>
        <td>{overDueDuration.toFixed(1)} Days</td>
      </tr>
    );
  });

  const upcomingTaskRows = upcomingTasks.map((task, index) => {
    const dueDateSt = DateTime.fromISO(task.dueDate).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A);
    return (
      <tr key={index}>
        <td>{task.name}</td>
        <td>{task.taskTitle}</td>
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

  const todayActivitiesRows = todayActivities.map((activity, index) => {
    return (
      <tr key={index}>
        <td>{activity.name}</td>
        <td>{activity.type}</td>
        <td>{activity.dueDate}</td>
      </tr>
    );
  });

  const projectsInProcessRows = projectsUnderDev.map((project, index) => {
    return (
      <tr key={index}>
        <td>{project.name}</td>
        <td>{project.dueDate}</td>
        <td>{project.timeRemaining}</td>
      </tr>
    );
  });

  const projectsWithMostClaimsRows = projectsWithMostClaims.map((project, index) => {
    return (
      <tr key={index}>
        <td>{project.project}</td>
        <td>{project.claimsCount}</td>
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
                {companies.length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Companies
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {contacts.length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Contacts
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {projects.filter((project) => project?.status === 6).length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Projects Completed
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {tasks.length}
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
                  {projectsUnderDev.length}
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
                  Delayed Tasks
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Assigned To</th>
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

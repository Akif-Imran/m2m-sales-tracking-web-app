import React, { useState } from "react";
import { useStyles } from "../styles";
import { colors } from "@theme";
import { Badge, Card, Grid, Loader, ScrollArea, Table, Tabs, Text, rem } from "@mantine/core";
import { Chart, GoogleChartOptions } from "react-google-charts";
import { IconCalendar, IconGraph } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A, projectStatusColors } from "@constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import {
  selectCompanies,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectProjectStatusList,
  selectLeadsWithRecords,
  useAppSelector,
  selectProspectTasksWithRecords,
} from "@store";
import { apiGet, urls } from "@api";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";

interface OwnProps {}
interface ChartData {
  data: (string | number)[][];
  total: number;
}

export const CRMDash: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  // const [isFetching, setIsFetching] = React.useState(false);
  const tasks = useAppSelector(selectProspectTasksWithRecords);
  const followUps = useAppSelector(selectFollowUpsWithRecords);
  const prospects = useAppSelector(selectLeadsWithRecords);
  const { data: projectStatusList } = useAppSelector(selectProjectStatusList);
  const { data: companies } = useAppSelector(selectCompanies);
  const { data: contacts } = useAppSelector(selectCompanyContact);
  const [calendarLoading, setIsCalendarLoading] = React.useState<boolean>(true);
  const [prospectCounts, setProspectCounts] = React.useState<ChartData>();
  const [prospectValueCounts, setProspectValueCounts] = React.useState<ChartData>();
  const [calendarTasks, setCalendarTasks] = React.useState<ICalendarEvent[]>([]);

  const [prospectsWithMostClaims, setProspectsWithMostClaims] = React.useState<
    { project: string; claimsCount: number }[]
  >([]);

  const [mostFollowedUpProspectsWithExpenses, setMostFollowedUpProspectsWithExpenses] = useState<
    {
      name: string;
      followUpCount: number;
      expenses: {
        amount: number;
        currency: string;
      };
    }[]
  >([{ name: "Project 1", followUpCount: 8, expenses: { amount: 15000, currency: "MYR" } }]);

  const [pendingTasks, setPendingTasks] = useState<
    { name: string; taskTitle: string; dueDate: string }[]
  >([]);

  const [noActivityReminder, setNoActivityReminder] = useState<
    { name: string; lastActivity: string | undefined; status: number; statusName: string }[]
  >([]);

  const [upcomingTasks, setUpcomingTasks] = useState<
    { name: string; taskTitle: string; dueDate: string }[]
  >([]);

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
    projectStatusList
      .filter((status) => status.id < 4) //id below 4 is prospect
      .forEach((value) => {
        const counts = prospects.filter((project) => project.status === value.id);
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
    setProspectValueCounts({
      data: valueLegends,
      total: totalValue,
    });
    setProspectCounts({
      data: projectsLegends,
      total: prospects.length,
    });
  }, [projectStatusList, prospects]);

  React.useEffect(() => {
    drawProjectCharts();
  }, [drawProjectCharts]);

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
      urls.claims.getHighestProjectClaims("false"),
      token
    )
      .then((res) => {
        if (res.data.success) {
          setProspectsWithMostClaims(res.data.data);
        }
      })
      .catch((err) => {
        console.error("No Activity: ", err?.message);
        notify("Highest Claims", "An error occurred", "error");
      });
  }, [token]);

  React.useEffect(() => {
    if (!token) return;
    apiGet<ApiResponse<IProject[]>>(urls.project.list("desc", 0, 10000, true, 10), token)
      .then((res) => {
        if (res.data.success) {
          const noActivity = res.data.data
            .filter((project) => project.status < 4)
            .map((project) => ({
              name: project.name,
              status: project.status,
              statusName:
                projectStatusList.find((status) => status.id === project.status)?.name || "N/A",
              lastActivity: project.updatedAt,
            }));
          setNoActivityReminder(noActivity);
        }
      })
      .catch((err) => {
        console.error("No Activity: ", err?.message);
        notify("No Activity", "An error occurred", "error");
      });
  }, [token, projectStatusList]);

  React.useEffect(() => {
    const mostFollowedLeadsWithExpense = prospects
      .filter((project) => project.status < 4)
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
    setMostFollowedUpProspectsWithExpenses(mostFollowedLeadsWithExpense);
  }, [prospects, followUps]);

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

  const mostFollowedUpLeadRows = mostFollowedUpProspectsWithExpenses.map((lead, index) => {
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

  const noActivityReminderRows = noActivityReminder.map((activity, index) => {
    return (
      <tr key={index}>
        <td>{activity.name}</td>
        <td>
          <Badge
            variant="filled"
            color={projectStatusColors[activity.status]}
            styles={{
              root: {
                width: "100%",
              },
            }}
          >
            {activity.statusName}
          </Badge>
        </td>
        <td>
          {activity.lastActivity
            ? DateTime.fromISO(activity.lastActivity).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)
            : "N/A"}
        </td>
      </tr>
    );
  });

  const projectsWithMostClaimsRows = prospectsWithMostClaims.map((project, index) => {
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
                {prospects.length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Prospects
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={3} lg={3} xl={3}>
            <Card p="sm" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                {prospects.filter((lead) => lead.status === 3).length}
              </Text>
              <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                Quotations
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {noActivityReminderRows.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Reminders
                </Text>
              </div>
              <ScrollArea h={rem(272)}>
                <Table>
                  <thead>
                    <tr>
                      <th>Prospect Name</th>
                      <th>Status</th>
                      <th>Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>{noActivityReminderRows}</tbody>
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
            <Card p="xs" shadow="sm" className={classes.card} my={4} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                  {prospectCounts?.total || 0}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Prospects
                </Text>
              </div>
              <Chart chartType="PieChart" data={prospectCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText}>
                  {prospectValueCounts?.total || 0}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Value
                </Text>
              </div>
              <Chart chartType="PieChart" data={prospectValueCounts?.data} options={options} />
            </Card>
          </Grid.Col>

          <Grid.Col md={6} lg={6} xl={6}>
            <Card p="xs" shadow="sm" className={classes.card} my={4} px={"xs"} radius={"md"}>
              <div className={classes.grayContainer}>
                <Text fw={"bold"} fz={rem(60)} color={colors.titleText} mt={-16}>
                  {mostFollowedUpLeadRows.length}
                </Text>
                <Text fz="md" className={classes.label} color={colors.titleText} mt={-10} mb={2}>
                  Most followed up prospects with expenses
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
                  {prospectsWithMostClaims.length}
                </Text>
                <Text
                  fz="md"
                  className={classes.label}
                  color={colors.titleText}
                  mt={-10}
                  mb={2}
                  ml={rem(8)}
                >
                  Prospects with most claims
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

export default CRMDash;

interface ICalendarEvent {
  title?: string;
  start?: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  allDay?: boolean;
}

import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import {
  IconFilterFilled,
  IconPlus,
  IconRotateClockwise2,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  selectRecordsForDropdown,
  selectTasksCombined,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { useGStyles } from "../../../styles";
import { colors } from "@theme";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A, taskStatusColors } from "@constants";
import { modalOverlayPropsHelper, openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteTask, updateTaskStatus } from "@slices";
import { _AddTaskModal } from "../components";
import { useAuthContext } from "@contexts";

interface OwnProps {}

interface State {
  status: number;
  company: number;
  project: number;
  assignedTo: number;
}
interface ListState {
  statusList: IDropDownList;
  companyList: IDropDownList;
  projectList: IDropDownList;
  assigneeList: IDropDownList;
}

const sortingInitialState: State = {
  status: 0,
  company: 0,
  project: 0,
  assignedTo: 0,
};
const sortingListInitialState: ListState = {
  statusList: [],
  companyList: [],
  projectList: [],
  assigneeList: [],
};

const Tasks: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { user, isAdmin, isSales },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchedData, setSearchedData] = React.useState<typeof tasks>([]);

  const [addTaskModalOpened, setAddTaskModalOpened] = React.useState(false);
  const { tasks } = useAppSelector(selectTasksCombined);
  const {
    taskStatus: taskStatusList,
    companies,
    projects,
    projectManagers,
    salesPersons,
  } = useAppSelector(selectRecordsForDropdown);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedTask, setSelectedTask] = React.useState<number>(0);

  const [sorting, setSorting] = React.useState<State>(sortingInitialState);
  const [sortingList, setSortingList] = React.useState<ListState>(sortingListInitialState);

  const showUpdateStatusModal = (taskId: number) => {
    setSelectedTask(taskId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (user?.userTypeName === "Admin") {
      const filtered = tasks.filter(
        (task) =>
          task.assignee?.firstName.toLowerCase().includes(query.toLowerCase()) ||
          task.assignee?.lastName.toLowerCase().includes(query.toLowerCase()) ||
          task.statusName.toLowerCase().includes(query.toLowerCase()) ||
          task.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = tasks.filter(
        (task) =>
          (task.assignee?.firstName.toLowerCase().includes(query.toLowerCase()) ||
            task.assignee?.lastName.toLowerCase().includes(query.toLowerCase()) ||
            task.statusName.toLowerCase().includes(query.toLowerCase()) ||
            task.title.toLowerCase().includes(query.toLowerCase())) &&
          task.assigneeId === user?.id
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    if (user?.userTypeName === "Admin") {
      setSearchedData(tasks);
    } else {
      const filtered = tasks.filter((task) => task.assigneeId === user?.id);
      setSearchedData(filtered);
    }
  }, [tasks, user]);

  React.useEffect(() => {
    setSortingList((_prev) => {
      return {
        statusList: [{ value: "0", label: "All" }].concat(taskStatusList),
        companyList: [{ value: "0", label: "All" }].concat(companies),
        projectList: [{ value: "0", label: "All" }].concat(projects),
        assigneeList: [{ value: "0", label: "All" }].concat(projectManagers.concat(salesPersons)),
      };
    });
  }, [taskStatusList, companies, projects, projectManagers, salesPersons]);

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Task`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this task? This action is destructive and you will have to
          contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Task",
      onConfirm: () => {
        dispatch(deleteTask(id));
        notify("Delete Task", "Task deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Task", "Operation canceled!", "error"),
    });
  };

  const clearSort = () => {
    if (user?.userTypeName === "Admin") {
      setSearchedData(tasks);
    } else {
      const filtered = tasks.filter((task) => task.assigneeId === user?.id);
      setSearchedData(filtered);
    }
    setSorting(sortingInitialState);
  };

  const handleSort = async (
    statusId: number,
    companyId: number,
    projectId: number,
    assignedToId: number
  ) => {
    console.log(statusId, companyId, projectId, assignedToId);
    let result = tasks;
    if (statusId) {
      result = result.filter((task) => task.statusId === statusId);
    }
    if (companyId) {
      result = result.filter((task) => task.companyId === companyId);
    }
    if (projectId) {
      result = result.filter((task) => task.projectId === projectId);
    }
    if (assignedToId) {
      result = result.filter((task) => task.assigneeId === assignedToId);
    }
    setSearchedData(result);
  };

  const handleOnChangeStatusFilter = (value: string | null) => {
    if (!value) return;
    const parsed = parseInt(value);
    setSorting((prev) => {
      handleSort(parsed, prev.company, prev.project, prev.assignedTo);
      return {
        ...prev,
        status: parsed,
      };
    });
  };
  const handleOnChangeProjectFilter = (value: string | null) => {
    if (!value) return;
    const parsed = parseInt(value);
    setSorting((prev) => {
      handleSort(prev.status, prev.company, parsed, prev.assignedTo);
      return {
        ...prev,
        project: parsed,
      };
    });
  };

  const handleOnChangeCompanyFilter = (value: string | null) => {
    if (!value) return;
    const parsed = parseInt(value);
    setSorting((prev) => {
      handleSort(prev.status, parsed, prev.project, prev.assignedTo);
      return {
        ...prev,
        company: parsed,
      };
    });
  };

  const handleOnChangeAssigneeFilter = (value: string | null) => {
    if (!value) return;
    const parsed = parseInt(value);
    setSorting((prev) => {
      handleSort(prev.status, prev.company, prev.project, parsed);
      return {
        ...prev,
        assignedTo: parsed,
      };
    });
  };

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Tasks
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((task, index) => (
          <tr key={task.id}>
            <td>{index + 1}</td>
            <td>{task.id}</td>
            <td>
              <Badge variant="filled" color={taskStatusColors[task.statusName]}>
                {task.statusName}
              </Badge>
            </td>
            {/* <td>{task.company?.name}</td> */}
            <td>company name</td>
            <td>{task.project?.name || "N/A"}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              {DateTime.fromISO(task.createdDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            <td>
              {task.assignee?.firstName} {task.assignee?.lastName}
            </td>
            <td>
              {DateTime.fromISO(task.plannedEndDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            <td>
              {task.completedDate
                ? DateTime.fromISO(task.completedDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)
                : "N/A"}
            </td>
            <td>
              <Group>
                <ActionIcon color="gray" size={"sm"} onClick={() => showUpdateStatusModal(task.id)}>
                  <IconRotateClockwise2 />
                </ActionIcon>
                {isAdmin && (
                  <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(task.id)}>
                    <IconTrash />
                  </ActionIcon>
                )}
              </Group>
            </td>
          </tr>
        ))}
      </>
    );

  return (
    <Stack spacing={"xs"}>
      <Flex gap={"md"} className={gclasses.searchContainer}>
        <TextInput
          value={searchQuery}
          className={gclasses.searchInput}
          placeholder="Search by any field"
          icon={<IconSearch size={16} />}
          onChange={(e) => onChangeSearch(e.target?.value)}
        />
        {isAdmin && (
          <Button
            variant="filled"
            rightIcon={<IconPlus size={16} />}
            onClick={() => setAddTaskModalOpened(true)}
          >
            Task
          </Button>
        )}
        <Button variant="filled" rightIcon={<IconFilterFilled size={16} />} onClick={clearSort}>
          Clear
        </Button>
      </Flex>
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={3}>Task</th>
                <th colSpan={1}>Company</th>
                <th colSpan={1}>Project</th>
                <th colSpan={7}>Task Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>
                  <Select
                    maw={rem(128)}
                    value={sorting.status.toString()}
                    withinPortal
                    withAsterisk={false}
                    label="Status"
                    variant="filled"
                    size="sm"
                    placeholder="Pick one"
                    data={sortingList.statusList}
                    onChange={handleOnChangeStatusFilter}
                  />
                </th>
                <th>
                  <Select
                    maw={rem(256)}
                    value={sorting.company.toString()}
                    withinPortal
                    withAsterisk={false}
                    label="Company Name"
                    variant="filled"
                    size="sm"
                    placeholder="Pick one"
                    data={sortingList.companyList}
                    onChange={handleOnChangeCompanyFilter}
                  />
                </th>
                <th>
                  <Select
                    maw={rem(256)}
                    value={sorting.project.toString()}
                    withinPortal
                    withAsterisk={false}
                    label="Project Name"
                    variant="filled"
                    size="sm"
                    placeholder="Pick one"
                    data={sortingList.projectList}
                    onChange={handleOnChangeProjectFilter}
                  />
                </th>
                <th>Task Title</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>
                  <Select
                    maw={rem(184)}
                    value={sorting.assignedTo.toString()}
                    withinPortal
                    withAsterisk={false}
                    label="Assigned To"
                    variant="filled"
                    size="sm"
                    placeholder="Pick one"
                    data={sortingList.assigneeList}
                    onChange={handleOnChangeAssigneeFilter}
                  />
                </th>
                <th>Deadline</th>
                <th>Completed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddTaskModal
        title="Add Task"
        opened={addTaskModalOpened}
        onClose={() => setAddTaskModalOpened(false)}
      />
      <Modal
        centered
        radius="md"
        opened={visible}
        onClose={hideUpdateStatusModal}
        title="Task Status"
        scrollAreaComponent={ScrollArea.Autosize}
        withinPortal
        withOverlay
        overlayProps={modalOverlayPropsHelper(theme)}
      >
        <Radio.Group
          value={selectedStatus}
          name="userFilter"
          defaultValue="7"
          onChange={(value) => {
            if (!value) {
              notify("Update Task Status", "Invalid status value", "error");
              return;
            }
            setSelectedStatus(value);
            const typeName = taskStatusList.find((status) => status.value === value)?.label;
            if (!typeName) return;
            dispatch(
              updateTaskStatus({
                taskId: selectedTask,
                statusId: parseInt(value),
                statusName: typeName,
              })
            );
            notify("Update Task Status", "Task status updated successfully!", "success");
            hideUpdateStatusModal();
          }}
        >
          <div className={gclasses.radioContainer}>
            {taskStatusList
              .filter((status) => (isSales ? status.label !== "Pending" : true))
              .map((value) => {
                return <Radio value={value.value} label={value.label} key={value.value} />;
              })}
          </div>
        </Radio.Group>
      </Modal>
    </Stack>
  );
};

export { Tasks };

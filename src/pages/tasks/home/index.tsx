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
import { deleteTask, modifyTaskStatus } from "@slices";
import { _AddTaskModal } from "../components";
import { useAuthContext } from "@contexts";
import { removeTask, updateStatusTask } from "@thunks";

interface OwnProps {}

interface State {
  status: number;
  company: string;
  project: string;
  assignedTo: string;
}
interface ListState {
  statusList: IDropDownList;
  companyList: IDropDownList;
  projectList: IDropDownList;
  assigneeList: IDropDownList;
}

const sortingInitialState: State = {
  status: 0,
  company: "0",
  project: "0",
  assignedTo: "0",
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
    state: { isAdmin, token },
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
    engineers,
    salesPersons,
  } = useAppSelector(selectRecordsForDropdown);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedTask, setSelectedTask] = React.useState<string>("");

  const [sorting, setSorting] = React.useState<State>(sortingInitialState);
  const [sortingList, setSortingList] = React.useState<ListState>(sortingListInitialState);

  const showUpdateStatusModal = (taskId: string) => {
    setSelectedTask(taskId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = tasks.filter(
      (task) =>
        task.assignee?.name.toLowerCase().includes(query.toLowerCase()) ||
        task?.statusName?.toLowerCase().includes(query.toLowerCase()) ||
        task.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(tasks);
  }, [tasks]);

  React.useEffect(() => {
    setSortingList((_prev) => {
      return {
        statusList: [{ value: "0", label: "All" }].concat(taskStatusList),
        companyList: [{ value: "0", label: "All" }].concat(companies),
        projectList: [{ value: "0", label: "All" }].concat(projects),
        assigneeList: [{ value: "0", label: "All" }].concat(engineers.concat(salesPersons)),
      };
    });
  }, [taskStatusList, companies, projects, engineers, salesPersons]);

  const handleDelete = (id: string) => {
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
        dispatch(
          removeTask({
            id,
            token,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Task", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteTask(id));
            }
          })
          .catch((err) => {
            console.log("Remove Task: ", err?.message);
            notify("Delete Task", "An error occurred", "error");
          });
      },
      onCancel: () => notify("Delete Task", "Operation canceled!", "error"),
    });
  };

  const clearSort = () => {
    setSearchedData(tasks);
    setSorting(sortingInitialState);
  };

  const handleSort = async (
    statusId: number,
    companyId: string,
    projectId: string,
    assignedToId: string
  ) => {
    console.log(statusId, companyId, projectId, assignedToId);
    let result = tasks;
    if (statusId) {
      result = result.filter((task) => task.status === statusId);
    }
    if (companyId) {
      result = result.filter((task) => (companyId === "0" ? true : task.customerId === companyId));
    }
    if (projectId) {
      result = result.filter((task) => (projectId === "0" ? true : task.projectId === projectId));
    }
    if (assignedToId) {
      result = result.filter((task) =>
        assignedToId === "0" ? true : task.assignedTo === assignedToId
      );
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
    setSorting((prev) => {
      handleSort(prev.status, prev.company, value, prev.assignedTo);
      return {
        ...prev,
        project: value,
      };
    });
  };

  const handleOnChangeCompanyFilter = (value: string | null) => {
    if (!value) return;
    setSorting((prev) => {
      handleSort(prev.status, value, prev.project, prev.assignedTo);
      return {
        ...prev,
        company: value,
      };
    });
  };

  const handleOnChangeAssigneeFilter = (value: string | null) => {
    if (!value) return;
    setSorting((prev) => {
      handleSort(prev.status, prev.company, prev.project, value);
      return {
        ...prev,
        assignedTo: value,
      };
    });
  };

  const handleOnChangeStatus = (value: null | string) => {
    if (!value) {
      notify("Update Task Status", "Invalid status value", "error");
      return;
    }
    setSelectedStatus(value);
    const typeName = taskStatusList.find((status) => status.value === value)?.label;
    if (!typeName) return;
    dispatch(
      updateStatusTask({
        id: selectedTask,
        token,
        body: {
          status: parseInt(value),
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Task Status", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyTaskStatus(res.data));
          hideUpdateStatusModal();
        }
      })
      .catch((err) => {
        console.log("Update Task Status: ", err?.message);
        notify("Update Task Status", "An error occurred", "error");
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
          <tr key={task._id}>
            <td>{index + 1}</td>
            <td>
              <Badge variant="filled" color={taskStatusColors[task.status]}>
                {task.statusName}
              </Badge>
            </td>
            <td>{task.company?.name || "N/A"}</td>
            <td>{task.project?.name || "N/A"}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              {DateTime.fromISO(task.createdAt).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            <td>{task.assignee?.name}</td>
            <td>
              {DateTime.fromISO(task.completionDeadline)
                .toLocal()
                .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            {/* <td>
              {task.completedDate
                ? DateTime.fromISO(task.completedDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)
                : "N/A"}
            </td> */}
            <td>
              <Group>
                <ActionIcon
                  color="gray"
                  size={"sm"}
                  onClick={() => showUpdateStatusModal(task._id)}
                >
                  <IconRotateClockwise2 />
                </ActionIcon>
                {isAdmin && (
                  <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(task._id)}>
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
                <th colSpan={2}>Task</th>
                <th colSpan={1}>Company</th>
                <th colSpan={1}>Project</th>
                <th colSpan={5}>Task Details</th>
                <th colSpan={1}>Action</th>
              </tr>
              <tr>
                <th>#</th>
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
                    value={sorting.company}
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
                {/* <th>Completed Date</th> */}
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
          onChange={handleOnChangeStatus}
        >
          <div className={gclasses.radioContainer}>
            {taskStatusList
              .filter((status) => (!isAdmin ? status.label !== "Pending" : true))
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

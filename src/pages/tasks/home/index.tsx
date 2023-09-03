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
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconRotateClockwise2, IconSearch, IconTrash } from "@tabler/icons-react";
import {
  selectRecordsForDropdown,
  selectTasksCombined,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { useGStyles } from "../../../styles";
import { colors } from "@theme";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { modalOverlayPropsHelper, openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteTask, updateTaskStatus } from "@slices";

interface OwnProps {}

const Tasks: React.FC<OwnProps> = () => {
  useStyles();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchedData, setSearchedData] = React.useState<typeof tasks>([]);

  const [addTaskModalOpened, setAddTaskModalOpened] = React.useState(false);
  const { tasks } = useAppSelector(selectTasksCombined);
  const { taskStatus: taskStatusList } = useAppSelector(selectRecordsForDropdown);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedTask, setSelectedTask] = React.useState<number>(0);

  const showUpdateStatusModal = (taskId: number) => {
    setSelectedTask(taskId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(query.toLowerCase()) ||
        task.statusName.toLowerCase().includes(query.toLowerCase()) ||
        task.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(tasks);
  }, [tasks]);

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
            <td>{task.name}</td>
            <td>{task.project?.name || "N/A"}</td>
            <td>{task.title}</td>
            <td>
              {DateTime.fromISO(task.createdDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            <td>
              {DateTime.fromISO(task.completedDate).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
            </td>
            <td>
              <Badge>{task.statusName}</Badge>
            </td>
            <td>
              <Group>
                <ActionIcon color="gray" size={"sm"} onClick={() => showUpdateStatusModal(task.id)}>
                  <IconRotateClockwise2 />
                </ActionIcon>
                <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(task.id)}>
                  <IconTrash />
                </ActionIcon>
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
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddTaskModalOpened(true)}
        >
          Task
        </Button>
      </Flex>
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"120vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Task</th>
                <th colSpan={1}>Project</th>
                <th colSpan={4}>Task Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>Name</th>
                <th>Status</th>

                <th>Project Name</th>

                <th>Title</th>
                <th>Created Date</th>
                <th>Completed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      {/* <_AddCompanyModal
        title="Add Company"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      /> */}
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
            const typeName = taskStatusList.find((status) => status.value === value)?.label;
            if (!typeName) return;
            dispatch(
              updateTaskStatus({
                taskId: selectedTask,
                statusId: parseInt(value),
                statusName: typeName,
              })
            );
            hideUpdateStatusModal();
          }}
        >
          <div className={gclasses.radioContainer}>
            {taskStatusList.map((value) => {
              return <Radio value={value.value} label={value.label} />;
            })}
          </div>
        </Radio.Group>
      </Modal>
    </Stack>
  );
};

export { Tasks };

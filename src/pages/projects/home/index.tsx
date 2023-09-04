import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
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
import {
  selectCompanies,
  selectProjects,
  selectRecordsForDropdown,
  selectUsers,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { useGStyles } from "../../../styles";
import { IconPlus, IconRotateClockwise2, IconSearch, IconTrash } from "@tabler/icons-react";
import { modalOverlayPropsHelper, openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { colors } from "@theme";
import { deleteProject, updateProjectStatus } from "@slices";
import { _AddProjectModal } from "../components";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY, projectStatusColors } from "@constants";
import { useAuthContext } from "@contexts";

interface OwnProps {}

const Projects: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const {
    state: { user },
  } = useAuthContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: projects } = useAppSelector(selectProjects);
  const { data: companies } = useAppSelector(selectCompanies);
  const { data: users } = useAppSelector(selectUsers);
  const [addProjectModalOpened, setAddProjectModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<IProject[]>([]);

  const { projectStatus: projectStatusList } = useAppSelector(selectRecordsForDropdown);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedProject, setSelectedProject] = React.useState<number>(0);

  const showUpdateStatusModal = (statusId: number, projectId: number) => {
    setSelectedStatus(statusId.toString());
    setSelectedProject(projectId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (user?.userTypeName === "Admin") {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query.toLowerCase()) &&
          (project.salesPersonId === user?.id || project.projectManagerId === user?.id)
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    if (user?.userTypeName === "Admin") {
      setSearchedData(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.salesPersonId === user?.id || project.projectManagerId === user?.id
      );
      setSearchedData(filtered);
    }
  }, [projects, user]);

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Project`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this project? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Project",
      onConfirm: () => {
        dispatch(deleteProject(id));
        notify("Delete Project", "Project deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Project", "Operation canceled!", "error"),
    });
  };

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Projects
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((project, index) => {
          const company = companies.find((company) => company.id === project.companyId);
          const sales = users.find((user) => user.id === project.salesPersonId);
          const projectManager = users.find((user) => user.id === project.projectManagerId);
          return (
            <tr key={project.id}>
              <td>{index + 1}</td>
              <td>
                <Avatar src={project.logo ? project.logo : "/user.png"} size={50} />
              </td>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>
                <Badge variant="filled" color={projectStatusColors[project.statusName]}>
                  {project.statusName}
                </Badge>
              </td>

              <td>{company?.name || "N/A"}</td>

              <td>{project.projectType}</td>
              <td>{project.city}</td>
              <td>{project.value} (RM)</td>
              <td>
                {sales?.firstName || "N/A"} {sales?.lastName || "N/A"}
              </td>
              <td>
                {projectManager?.firstName || "N/A"} {projectManager?.lastName || "N/A"}
              </td>
              <td>{DateTime.fromISO(project.startDate).toLocal().toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{DateTime.fromISO(project.plannedEndDate).toLocal().toFormat(DAY_MM_DD_YYYY)}</td>
              <td>
                {isAdmin ? (
                  <Group>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(project.statusId, project.id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(project.id)}>
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                ) : (
                  "Admin Required"
                )}
              </td>
            </tr>
          );
        })}
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
          // rightSection={
          //   <IconFilter size={14} color={colors.borderColor} onClick={showFilterModal} />
          // }
        />
        {isAdmin && (
          <Button
            variant="filled"
            rightIcon={<IconPlus size={16} />}
            onClick={() => setAddProjectModalOpened(true)}
          >
            Project
          </Button>
        )}
      </Flex>
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={5}>Project</th>
                <th colSpan={1}>Company</th>
                <th colSpan={8}>Project Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Id</th>
                <th>Name</th>
                <th>Status</th>

                <th>Customer Name</th>
                <th>Project Type</th>
                <th>City</th>
                <th>Value (RM)</th>

                <th>Sales Person</th>
                <th>Project Manager</th>
                <th>Start Date</th>
                <th>Planned End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddProjectModal
        title="Add Project"
        opened={addProjectModalOpened}
        onClose={() => setAddProjectModalOpened(false)}
      />
      <Modal
        centered
        radius="md"
        opened={visible}
        onClose={hideUpdateStatusModal}
        title="Project Status"
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
              notify("Update Project Status", "Invalid status value", "error");
              return;
            }
            const typeName = projectStatusList.find((status) => status.value === value)?.label;
            if (!typeName) return;
            dispatch(
              updateProjectStatus({
                projectId: selectedProject,
                statusId: parseInt(value),
                statusName: typeName,
              })
            );
            hideUpdateStatusModal();
          }}
        >
          <div className={gclasses.radioContainer}>
            {projectStatusList.map((value) => {
              return <Radio value={value.value} label={value.label} key={value.value} />;
            })}
          </div>
        </Radio.Group>
      </Modal>
    </Stack>
  );
};

export { Projects };

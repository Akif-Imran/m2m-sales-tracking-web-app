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
import {
  selectProjectWithRecords,
  selectRecordsForDropdown,
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
import { useSearchParams } from "react-router-dom";
import { removeProject, updateStatusProject } from "@thunks";

interface OwnProps {}

interface ProjectSort {
  statusName: string;
  salesPerson: string;
  // Add other properties as needed
}

const Projects: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [searchParams, _setSearchParams] = useSearchParams();
  const modal = searchParams.get("open");

  const [searchQuery, setSearchQuery] = React.useState("");
  const projects = useAppSelector(selectProjectWithRecords);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [addProjectModalOpened, setAddProjectModalOpened] = React.useState(modal === "add");
  const [searchedData, setSearchedData] = React.useState<typeof projects>([]);

  const { projectStatus: projectStatusList } = useAppSelector(selectRecordsForDropdown);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedProject, setSelectedProject] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<ProjectSort>({
    statusName: "asc", // Initial sorting order (asc or desc)
    salesPerson: "asc",
  });

  const showUpdateStatusModal = (statusId: number, projectId: string) => {
    setSelectedStatus(statusId.toString());
    setSelectedProject(projectId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  const sortData = (columnName: keyof ProjectSort) => {
    const sortOrderCopy = { ...sortOrder };
    sortOrderCopy[columnName] = sortOrderCopy[columnName] === "asc" ? "desc" : "asc";
    setSortOrder(sortOrderCopy);

    // Sort your data based on the selected column
    // For example, if columnName is 'status':
    const sortedData = [...searchedData].sort((a, b) => {
      const valueA = a[columnName]?.toString().toLowerCase();
      const valueB = b[columnName]?.toString().toLowerCase();
      if (!valueA || !valueB) {
        notify("Sort", "Invalid paramters", "error");
        return -1;
      }
      if (sortOrderCopy[columnName] === "asc") {
        return valueA?.localeCompare(valueB);
      } else {
        return valueB?.localeCompare(valueA);
      }
    });

    setSearchedData(sortedData);
  };

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Project`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this project? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Project",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeProject({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            if (res.success) {
              dispatch(deleteProject(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete project: ", err?.message);
            notify("Delete Project", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });

        notify("Delete Project", "Project deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Project", "Operation canceled!", "error"),
    });
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) {
      notify("Update Project Status", "Invalid status value", "error");
      return;
    }
    dispatch(
      updateStatusProject({
        token,
        id: selectedProject,
        body: {
          status: parseInt(value),
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Project Status", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(updateProjectStatus(res.data));
          hideUpdateStatusModal();
        }
      })
      .catch((err) => {
        console.log("Update Project Status: ", err?.message);
        notify("Project Status", "An error occurred", "error");
      });
  };

  React.useEffect(() => {
    setSearchedData(projects);
  }, [projects]);

  // React.useEffect(() => {
  //   if (modal === "add") {
  //     setAddProjectModalOpened(true);
  //   }
  // }, [modal]);

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
          const value = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: project.value.currency,
            maximumFractionDigits: 2,
          }).format(project.value.amount);
          return (
            <tr key={project._id}>
              <td>{index + 1}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>
                <Badge variant="filled" color={projectStatusColors[project.status]}>
                  {project.statusName}
                </Badge>
              </td>
              <td>{project.type}</td>
              <td>{value}</td>
              <td>{DateTime.fromISO(project.contractDate).toLocal().toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{DateTime.fromISO(project.deliveryDate).toLocal().toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{project.quotation}</td>
              <td>{project?.salesPersonValue?.name || "N/A"}</td>
              <td>{project?.company?.name || "N/A"}</td>
              <td>
                {isAdmin ? (
                  <Group>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(project.status, project._id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(project._id)}>
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
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Project</th>
                <th colSpan={6}>Project Details</th>
                <th colSpan={1}>Company</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th onClick={() => sortData("statusName")}>
                  Status {sortOrder.statusName === "asc" ? "▲" : "▼"}
                </th>
                <th>Project Type</th>
                <th>Value</th>
                <th>Contract Date</th>
                <th>Delivery Date</th>
                <th>Quotation</th>
                <th onClick={() => sortData("salesPerson")}>
                  Sales Person {sortOrder.salesPerson === "asc" ? "▲" : "▼"}
                </th>
                <th>Customer Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddProjectModal
        title="Add Lead/Project"
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
          onChange={handleOnChangeStatus}
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

import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  Flex,
  Grid,
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
  selectLeadsWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { useGStyles, noImageStyle } from "@global-styles";
import {
  IconCornerDownRight,
  IconId,
  IconPlus,
  IconRotateClockwise2,
  IconSearch,
  IconTable,
  IconTrash,
  // IconUserCog,
} from "@tabler/icons-react";
import { modalOverlayPropsHelper, openConfirmModalHelper, openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { colors } from "@theme";
import { deleteLead } from "@slices";
import { _AddLeadModal, _AssignEngineerModal, _LeadCard } from "../components";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY, projectStatusColors } from "@constants";
import { useAuthContext } from "@contexts";
import { Outlet, useSearchParams } from "react-router-dom";
import { removeProject, updateStatusProject } from "@thunks";
import { useToggle } from "@mantine/hooks";
import { BASE_URL } from "@api";

interface OwnProps {}

interface LeadSort {
  statusName: string;
  salesPerson: string;
  // Add other properties as needed
}

export const Leads: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR, token, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [viewMode, toggle] = useToggle(["cards", "list"]);
  const [searchParams, _setSearchParams] = useSearchParams();
  const modal = searchParams.get("open");
  const customerId = searchParams.get("customerId") || "";

  const [searchQuery, setSearchQuery] = React.useState("");
  const leads = useAppSelector(selectLeadsWithRecords);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [addModalOpened, setAddModalOpened] = React.useState(modal === "add");
  const [assignEngineerModalOpened, setAssignEngineerModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof leads>([]);

  const { leadStatus: leadsStatusList } = useAppSelector(selectRecordsForDropdown);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>();
  const [selectedLead, setSelectedLead] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<LeadSort>({
    statusName: "asc", // Initial sorting order (asc or desc)
    salesPerson: "asc",
  });

  const showUpdateStatusModal = (statusId: number, leadId: string) => {
    setSelectedStatus(statusId.toString());
    setSelectedLead(leadId);
    setVisible(true);
  };
  const showAssignEngineerModal = (leadId: string) => {
    setSelectedLead(leadId);
    setAssignEngineerModalOpened(true);
  };

  const hideUpdateStatusModal = () => setVisible(false);
  const hideAssignEngineerModal = () => setAssignEngineerModalOpened(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = leads.filter((lead) => lead.name.toLowerCase().includes(query.toLowerCase()));
    setSearchedData(filtered);
  };

  const sortData = (columnName: keyof LeadSort) => {
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
      title: `Delete Lead`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Lead? This action is destructive and you will have to
          contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Lead",
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
              dispatch(deleteLead(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete Lead: ", err?.message);
            notify("Delete Lead", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });

        notify("Delete Lead", "Lead deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Lead", "Operation canceled!", "error"),
    });
  };

  const handleMoveToProjects = (prospectId: string) => {
    openConfirmModalHelper({
      theme: theme,
      title: `Move to Projects`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to move this Prospect to Projects? This will mark the prospect as a
          project with status of "WORK ORDER RECEIVED". This action is irreversible.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Move",
      onConfirm: () => {
        dispatch(
          updateStatusProject({
            token,
            id: prospectId,
            body: {
              status: 4,
            },
          })
        )
          .unwrap()
          .then((res) => {
            notify("Move to Projects", res?.message, res.success ? "success" : "error");
            if (res.success) {
              // dispatch(modifyLeadStatus(res.data));
            }
          })
          .catch((err) => {
            console.log("Move to Projects", err?.message);
            notify("Move to Projects", "An error occurred", "error");
          });
      },
      onCancel: () => notify("Delete Prospect", "Operation canceled!", "error"),
    });
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) {
      notify("Update Lead Status", "Invalid status value", "error");
      return;
    }
    dispatch(
      updateStatusProject({
        token,
        id: selectedLead,
        body: {
          status: parseInt(value),
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Lead Status", res?.message, res.success ? "success" : "error");
        if (res.success) {
          // dispatch(modifyLeadStatus(res.data));
          hideUpdateStatusModal();
        }
      })
      .catch((err) => {
        console.log("Update Lead Status: ", err?.message);
        notify("Lead Status", "An error occurred", "error");
      });
  };

  React.useEffect(() => {
    setSearchedData(leads);
  }, [leads]);

  let icon: JSX.Element;
  if (viewMode === "cards") {
    icon = <IconId size={22} color={colors.white} />;
  } else {
    icon = <IconTable size={22} color={colors.white} />;
  }

  const rows =
    searchedData.length === 0 ? (
      <Container>
        <Center>No Prospects</Center>
      </Container>
    ) : (
      <>
        {searchedData.map((prospect, index) => {
          const value = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: prospect.value.currency,
            maximumFractionDigits: 2,
          }).format(prospect.value.amount);

          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={prospect._id}>
                <_LeadCard
                  item={prospect}
                  handleDelete={handleDelete}
                  assignEngineer={showAssignEngineerModal}
                  updateStatus={showUpdateStatusModal}
                  moveToProject={handleMoveToProjects}
                />
              </Grid.Col>
            );
          } else if (viewMode === "list") {
            return (
              <tr key={prospect._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={
                      prospect?.images.length > 0
                        ? `${BASE_URL}\\${prospect?.images[0]}`
                        : "/company.png"
                    }
                    size={50}
                    //@ts-expect-error style works
                    styles={prospect.images.length > 0 ? undefined : noImageStyle}
                  />
                </td>
                <td>{prospect.name}</td>
                <td>{prospect.description}</td>
                <td>
                  <Badge
                    variant="filled"
                    color={projectStatusColors[prospect.status]}
                    styles={{
                      root: {
                        width: "100%",
                      },
                    }}
                  >
                    {prospect.statusName}
                  </Badge>
                </td>
                <td>{prospect.type}</td>
                <td>{value}</td>
                <td>
                  {DateTime.fromISO(prospect.contractDate).toLocal().toFormat(DAY_MM_DD_YYYY)}
                </td>
                <td>
                  {DateTime.fromISO(prospect.deliveryDate).toLocal().toFormat(DAY_MM_DD_YYYY)}
                </td>
                <td>{prospect.quotation}</td>
                <td>
                  {prospect.salesPerson !== user?._id
                    ? prospect?.salesPersonValue?.name || "N/A"
                    : "(You)"}
                </td>
                <td>
                  {prospect?.engineer ? prospect?.engineerValue?.name || "N/A" : "Not Assigned"}
                </td>
                <td>{prospect?.company?.name || "N/A"}</td>
                <td>
                  <Group>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(prospect.status, prospect._id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                    {(isAdmin || isHR) && (
                      <ActionIcon
                        color="gray"
                        size={"sm"}
                        onClick={() => handleMoveToProjects(prospect._id)}
                      >
                        <IconCornerDownRight />
                      </ActionIcon>
                    )}
                    {isAdmin && (
                      <React.Fragment>
                        {/* <ActionIcon
                          color="gray"
                          size={"sm"}
                          onClick={() => showAssignEngineerModal(prospect._id)}
                        >
                          <IconUserCog />
                        </ActionIcon> */}
                        <ActionIcon
                          color="red"
                          size={"sm"}
                          onClick={() => handleDelete(prospect._id)}
                        >
                          <IconTrash />
                        </ActionIcon>
                      </React.Fragment>
                    )}
                  </Group>
                </td>
              </tr>
            );
          } else {
            return (
              <_LeadCard
                key={prospect._id}
                item={prospect}
                handleDelete={handleDelete}
                assignEngineer={showAssignEngineerModal}
                updateStatus={showUpdateStatusModal}
                moveToProject={handleMoveToProjects}
              />
            );
          }
        })}
      </>
    );

  let content: JSX.Element;
  if (viewMode === "cards") {
    content = <Grid columns={12}>{rows}</Grid>;
  } else if (viewMode === "list") {
    content = (
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Prospect</th>
                <th colSpan={6}>Prospect Details</th>
                <th colSpan={1}>Contact</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th onClick={() => sortData("statusName")}>
                  Status {sortOrder.statusName === "asc" ? "▲" : "▼"}
                </th>
                <th>Prospect Type</th>
                <th>Value</th>
                <th>Contract Date</th>
                <th>Delivery Date</th>
                <th>Quotation</th>
                <th onClick={() => sortData("salesPerson")}>
                  Sales Person {sortOrder.salesPerson === "asc" ? "▲" : "▼"}
                </th>
                <th>Engineer</th>
                <th>Contact Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
    );
  } else {
    content = (
      <Grid>
        <Grid.Col span={4}>{rows}</Grid.Col>
        <Grid.Col span={8}>
          <Outlet />
        </Grid.Col>
      </Grid>
    );
  }

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
        <ActionIcon
          variant="filled"
          size={"2.2rem"}
          color={theme.primaryColor}
          onClick={() => toggle()}
        >
          {icon}
        </ActionIcon>
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
        >
          Prospect
        </Button>
      </Flex>

      {content}
      <_AddLeadModal
        title="Add Prospect"
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        companyId={customerId}
      />
      <_AssignEngineerModal
        title="Assign Engineer"
        opened={assignEngineerModalOpened}
        onClose={hideAssignEngineerModal}
        projectId={selectedLead}
      />
      <Modal
        centered
        radius="md"
        opened={visible}
        onClose={hideUpdateStatusModal}
        title="Prospect Status"
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
            {leadsStatusList.map((value) => {
              return <Radio value={value.value} label={value.label} key={value.value} />;
            })}
          </div>
        </Radio.Group>
      </Modal>
    </Stack>
  );
};

export default Leads;

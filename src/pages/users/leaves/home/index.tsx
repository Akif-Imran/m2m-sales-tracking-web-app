import React from "react";
import { useStyles } from "./styles";
import { selectLeavesWithRecords, useAppDispatch, useAppSelector } from "@store";
import { useGStyles } from "@global-styles";
import { openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteLeave } from "@slices";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconRotateClockwise2, IconSearch, IconTrash } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY, leavesStatusColors, leavesTypeColors } from "@constants";
import { colors } from "@theme";
import { _AddLeaveModal, _UpdateLeaveModal } from "../components";
import { useAuthContext } from "@contexts";
import { BASE_URL } from "@api";

interface OwnProps {}

export const LeaveApplications: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addUserModalOpened, setAddUserModalOpened] = React.useState(false);
  const leaves = useAppSelector(selectLeavesWithRecords);
  const [searchedData, setSearchedData] = React.useState<typeof leaves>([]);

  const [updateStatusValues, setUpdateStatusValues] = React.useState<{
    statusId: number;
    leaveId: string;
    visible: boolean;
  }>({
    statusId: 0,
    leaveId: "",
    visible: false,
  });

  const showUpdateStatusModal = (statusId: number, leaveId: string) => {
    setUpdateStatusValues((prev) => ({
      ...prev,
      statusId: statusId,
      leaveId: leaveId,
      visible: true,
    }));
  };
  const hideUpdateStatusModal = () =>
    setUpdateStatusValues((prev) => ({ ...prev, visible: false }));

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin || isHR) {
      const filtered = leaves.filter(
        (leave) =>
          leave.name.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.type.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave?.statusName?.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.remarks.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.reason.toLowerCase().includes(query.toLocaleLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = leaves.filter(
        (leave) =>
          (leave.name.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.type.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave?.statusName?.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.remarks.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.reason.toLowerCase().includes(query.toLocaleLowerCase())) &&
          leave.createdBy === user?._id
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    setSearchedData(leaves);
  }, [leaves]);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Leave`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Leave? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Leave",
      onConfirm: () => {
        dispatch(deleteLeave(id));
        notify("Delete Leave", "Leave deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Leave", "Operation canceled!", "error"),
    });
  };

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Leaves
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((leave, index) => {
          return (
            <tr key={leave._id}>
              <td>{index + 1}</td>
              <td>
                <Avatar
                  src={leave.document ? `${BASE_URL}\\${leave.document}` : "/user.png"}
                  size={50}
                />
              </td>
              <td>{leave.name}</td>
              <td>
                <Badge variant="filled" color={leavesStatusColors[leave.status]}>
                  {leave.statusName}
                </Badge>
              </td>
              <td>{leave.requestByPerson?.name || "N/A"}</td>
              <td>
                <Badge variant="filled" color={leavesTypeColors[leave.type]}>
                  {leave.type}
                </Badge>
              </td>
              <td>{DateTime.fromISO(leave.startDate).toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{DateTime.fromISO(leave.endDate).toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{leave.reason}</td>
              <td>{leave?.remarks || "N/A"}</td>
              <td>
                <Group>
                  {(isHR || isAdmin) && (
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(leave.status, leave._id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                  )}
                  {isAdmin && (
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(leave._id)}>
                      <IconTrash />
                    </ActionIcon>
                  )}
                </Group>
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
        />
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddUserModalOpened(true)}
        >
          Leave Application
        </Button>
      </Flex>
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Leave</th>
                <th colSpan={1}>Person</th>
                <th colSpan={6}>Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Proof</th>
                <th>Name</th>
                <th>Status</th>

                <th>Requested By</th>

                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>

      <_AddLeaveModal
        title="Add Leave Application"
        opened={addUserModalOpened}
        onClose={() => setAddUserModalOpened(false)}
      />

      <_UpdateLeaveModal
        title="Update Leave Application"
        opened={updateStatusValues.visible}
        onClose={() => hideUpdateStatusModal()}
        leaveId={updateStatusValues.leaveId}
        statusId={updateStatusValues.statusId}
      />
    </Stack>
  );
};

export default LeaveApplications;

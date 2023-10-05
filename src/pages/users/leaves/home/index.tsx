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
    leaveId: number;
    visible: boolean;
  }>({
    leaveId: 0,
    statusId: 0,
    visible: false,
  });

  const showUpdateStatusModal = (statusId: number, leaveId: number) => {
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
          leave.typeName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.statusName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.remarks.toLowerCase().includes(query.toLocaleLowerCase()) ||
          leave.reason.toLowerCase().includes(query.toLocaleLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = leaves.filter(
        (leave) =>
          (leave.name.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.typeName.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.statusName.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.remarks.toLowerCase().includes(query.toLocaleLowerCase()) ||
            leave.reason.toLowerCase().includes(query.toLocaleLowerCase())) &&
          leave.requestedById === user?.id
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    setSearchedData(leaves);
  }, [leaves]);

  const handleDelete = (id: number) => {
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
            <tr key={leave.id}>
              <td>{index + 1}</td>
              <td>{leave.id}</td>
              <td>
                <Avatar src={leave.proof ? leave.proof : "/user.png"} size={50} />
              </td>
              <td>{leave.name}</td>
              <td>
                <Badge variant="filled" color={leavesStatusColors[leave.statusId]}>
                  {leave.statusName}
                </Badge>
              </td>
              <td>
                <Badge variant="filled" color={leavesTypeColors[leave.typeId]}>
                  {leave.typeName}
                </Badge>
              </td>
              <td>{DateTime.fromISO(leave.startDate).toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{DateTime.fromISO(leave.endDate).toFormat(DAY_MM_DD_YYYY)}</td>
              <td>{leave.reason}</td>
              <td>{leave.remarks}</td>
              <td>
                <Group>
                  {isHR && (
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(leave.statusId, leave.id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                  )}
                  {isAdmin && (
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(leave.id)}>
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
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={5}>Leave</th>
                <th colSpan={6}>Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>Proof</th>
                <th>Name</th>
                <th>Status</th>

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

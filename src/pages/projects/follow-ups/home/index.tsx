import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { selectFollowUpsWithRecords, useAppDispatch, useAppSelector } from "@store";
import { useGStyles } from "../../../../styles";
import { openDeleteModalHelper } from "@helpers";
import { colors } from "@theme";
import { notify } from "@utility";
import { useAuthContext } from "@contexts";
import { deleteFollowUp } from "@slices";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { DateTime } from "luxon";
import { _AddFollowUpModal } from "../components";
import { removeFollowUp } from "@thunks";
import { BASE_URL } from "@api";
import { PhotoView } from "react-photo-view";

interface OwnProps {}

export const FollowUps: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [searchQuery, setSearchQuery] = React.useState("");
  const followups = useAppSelector(selectFollowUpsWithRecords);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof followups>([]);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = followups.filter(
      (followup) =>
        followup.lead?.name.toLowerCase().includes(query.toLowerCase()) ||
        followup.contactPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
        followup.followUpPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
        followup.meetingPlace?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Follow Up`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Follow Up? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Follow Up",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeFollowUp({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Follow Up", res?.message, res?.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteFollowUp(res.data?._id));
            }
          })
          .catch((err) => {
            console.log("Delete Follow Up:", err?.message);
            notify("Delete Follow Up", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Follow Up", "Operation canceled!", "error"),
    });
  };

  React.useEffect(() => {
    setSearchedData(followups);
  }, [followups]);

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Projects
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((followup, index) => {
          const value = followup.expensePrice
            ? Intl.NumberFormat("en-US", {
                style: "currency",
                currency: followup.expensePrice?.currency,
                maximumFractionDigits: 2,
              }).format(followup.expensePrice?.amount)
            : "N/A";
          return (
            <tr key={followup._id}>
              <td>{index + 1}</td>
              <td>{followup.lead?.name}</td>
              <td>{followup.contactPerson?.name}</td>
              <td>
                {DateTime.fromISO(followup.meetingDate)
                  .toLocal()
                  .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
              </td>
              <td>{followup.meetingPlace}</td>
              <td>{followup.address}</td>
              <td>{followup.city}</td>
              <td>{followup.state}</td>
              <td>{followup.country}</td>
              <td>{followup.meetingAgenda}</td>
              <td>{followup.meetingSummary}</td>
              {/* next follow up */}
              <td>{followup?.nextMeetingPlace}</td>
              <td>
                {followup?.nextMeetingDate
                  ? DateTime.fromISO(followup?.nextMeetingDate)
                      .toLocal()
                      .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)
                  : "N/A"}
              </td>
              <td>{followup?.nextMeetingAgenda}</td>
              {/* claims on this follow up */}
              <td>{followup?.expenseTypeDetail?.name}</td>
              <td>{followup?.expenseName}</td>
              <td>{value}</td>
              <td>
                {followup?.expenseDocument ? (
                  <PhotoView key={followup._id} src={`${BASE_URL}\\${followup?.expenseDocument}`}>
                    <Avatar
                      src={`${BASE_URL}\\${followup?.expenseDocument}`}
                      size={50}
                      radius={"xs"}
                    />
                  </PhotoView>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {isAdmin ? (
                  <Group>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(followup._id)}>
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
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddFollowUpModalOpened(true)}
        >
          Follow Up
        </Button>
      </Flex>
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={11}>Project</th>
                <th colSpan={3}>Next Follow Up</th>
                <th colSpan={4}>Expense</th>
                <th colSpan={1}>Action</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Lead/Project</th>
                <th>Meeting With</th>
                <th>Meeting Date/Time</th>
                <th>Place</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Agenda</th>
                <th>Summary</th>

                <th>Place</th>
                <th>Date/Time</th>
                <th>Agenda</th>

                <th>Type</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Receipt</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddFollowUpModal
        title="Add Follow Up"
        opened={addFollowUpModalOpened}
        onClose={() => setAddFollowUpModalOpened(false)}
      />
    </Stack>
  );
};

export default FollowUps;

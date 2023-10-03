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

interface OwnProps {}

export const FollowUps: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [searchQuery, setSearchQuery] = React.useState("");
  const followups = useAppSelector(selectFollowUpsWithRecords);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof followups>([]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (user?.userTypeName === "Admin") {
      const filtered = followups.filter(
        (followup) =>
          followup.project?.name.toLowerCase().includes(query.toLowerCase()) ||
          followup.contactPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
          followup.followUpPerson?.firstName.toLowerCase().includes(query.toLowerCase()) ||
          followup.followUpPerson?.lastName.toLowerCase().includes(query.toLowerCase()) ||
          followup.meetingPlace?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = followups.filter(
        (followup) =>
          (followup.project?.name.toLowerCase().includes(query.toLowerCase()) ||
            followup.contactPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
            followup.followUpPerson?.firstName.toLowerCase().includes(query.toLowerCase()) ||
            followup.followUpPerson?.lastName.toLowerCase().includes(query.toLowerCase()) ||
            followup.meetingPlace?.toLowerCase().includes(query.toLowerCase())) &&
          followup.followUpPersonId === user?.id
      );
      setSearchedData(filtered);
    }
  };

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Follow Up`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Follow Up? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Follow Up",
      onConfirm: () => {
        dispatch(deleteFollowUp(id));
        notify("Delete Follow Up", "Follow Up deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Follow Up", "Operation canceled!", "error"),
    });
  };

  React.useEffect(() => {
    if (user?.userTypeName === "Admin") {
      setSearchedData(followups);
    } else {
      const filtered = followups.filter((followup) => followup.followUpPersonId === user?.id);
      setSearchedData(filtered);
    }
  }, [followups, user]);

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
          const value = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: followup.expenses.amount.currency,
            maximumFractionDigits: 2,
          }).format(followup.expenses.amount.amount);
          return (
            <tr key={followup.id}>
              <td>{index + 1}</td>
              <td>{followup.id}</td>
              <td>{followup.project?.name}</td>
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
              <td>{followup.nextFollowUp.place}</td>
              <td>
                {DateTime.fromISO(followup.nextFollowUp.meetingDate)
                  .toLocal()
                  .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
              </td>
              <td>{followup.nextFollowUp.meetingAgenda}</td>
              {/* claims on this follow up */}
              <td>{followup.expenses.type}</td>
              <td>{followup.expenses.name}</td>
              <td>{value}</td>
              <td>
                <Avatar src={followup.expenses.receipt} size={50} radius={"xs"} />
              </td>
              <td>
                {isAdmin ? (
                  <Group>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(followup.id)}>
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
            onClick={() => setAddFollowUpModalOpened(true)}
          >
            Follow Up
          </Button>
        )}
      </Flex>
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={12}>Project</th>
                <th colSpan={3}>Next Follow Up</th>
                <th colSpan={4}>Expense</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Id</th>
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

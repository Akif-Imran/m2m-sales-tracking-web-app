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
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A, claimStatusColors } from "@constants";
import { colors } from "@theme";
import { notify } from "@utility";
import { modalOverlayPropsHelper, openDeleteModalHelper } from "@helpers";
import { useAuthContext } from "@contexts";
import { useGStyles } from "@global-styles";
import { deleteClaim, updateClaimStatus } from "@slices";
import { _AddClaimModal } from "../components";
import {
  selectClaimsWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";

interface OwnProps {}

export const Claims: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const { claimsStatus } = useAppSelector(selectRecordsForDropdown);

  const [searchQuery, setSearchQuery] = React.useState("");
  const claims = useAppSelector(selectClaimsWithRecords);
  const [addClaimModalOpened, setAddClaimModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof claims>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("1");
  const [selectedClaim, setSelectedClaim] = React.useState<number>(0);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin || isHR) {
      const filtered = claims.filter(
        (request) =>
          request.project?.name.toLowerCase().includes(query.toLowerCase()) ||
          request.supplier?.name?.toLowerCase().includes(query.toLowerCase()) ||
          request.requestByPerson?.firstName.toLowerCase().includes(query.toLowerCase()) ||
          request.requestByPerson?.lastName.toLowerCase().includes(query.toLowerCase()) ||
          request.itemName?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = claims.filter(
        (followup) =>
          (followup.project?.name.toLowerCase().includes(query.toLowerCase()) ||
            followup.supplier?.name.toLowerCase().includes(query.toLowerCase()) ||
            followup.requestByPerson?.firstName.toLowerCase().includes(query.toLowerCase()) ||
            followup.requestByPerson?.lastName.toLowerCase().includes(query.toLowerCase()) ||
            followup.itemName?.toLowerCase().includes(query.toLowerCase())) &&
          followup.requestByPerson === user?.id
      );
      setSearchedData(filtered);
    }
  };

  const showUpdateStatusModal = (statusId: number, requestId: number) => {
    setSelectedStatus(statusId.toString());
    setSelectedClaim(requestId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Claim`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Claim? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Claim",
      onConfirm: () => {
        dispatch(deleteClaim(id));
        notify("Delete Claim", "Claim deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Claim", "Operation canceled!", "error"),
    });
  };

  React.useEffect(() => {
    if (isAdmin || isHR) {
      setSearchedData(claims);
    } else {
      const filtered = claims.filter((followup) => followup.requestedById === user?.id);
      setSearchedData(filtered);
    }
  }, [claims, isAdmin, isHR, user?.id]);

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Projects
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((request, index) => {
          const value = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: request.price.currency,
            maximumFractionDigits: 2,
          }).format(request.price.amount);
          return (
            <tr key={request.id}>
              <td>{index + 1}</td>
              <td>{request.id}</td>
              <td>{request.itemName}</td>
              <td>{request.itemType}</td>
              <td>
                {" "}
                <Badge variant="filled" color={claimStatusColors[request.statusId]}>
                  {request.statusName}
                </Badge>
              </td>
              <td>{request.project?.name}</td>
              <td>
                {request.requestByPerson?.firstName} {request.requestByPerson?.lastName}
              </td>
              <td>
                {DateTime.fromISO(request.warranty).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
              </td>
              <td>{request.qty}</td>
              <td>{request.supplier?.name}</td>
              <td>{value}</td>
              <td>{request.remarks}</td>
              <td>
                <Group>
                  {isHR && (
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(request.statusId, request.id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                  )}
                  {isAdmin && (
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(request.id)}>
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
          // rightSection={
          //   <IconFilter size={14} color={colors.borderColor} onClick={showFilterModal} />
          // }
        />
        {!isHR && (
          <Button
            variant="filled"
            rightIcon={<IconPlus size={16} />}
            onClick={() => setAddClaimModalOpened(true)}
          >
            Claim
          </Button>
        )}
      </Flex>
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={5}>Claim</th>
                <th colSpan={8}>Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>Item Name</th>
                <th>Item Type</th>
                <th>Status</th>

                <th>Project</th>
                <th>Request By</th>
                <th>Warranty</th>
                <th>Qty</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Remarks</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddClaimModal
        title="Add Claim"
        opened={addClaimModalOpened}
        onClose={() => setAddClaimModalOpened(false)}
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
          onChange={(value) => {
            if (!value) {
              notify("Update Claim Status", "Invalid status value", "error");
              return;
            }
            const typeName = claimsStatus.find((status) => status.value === value)?.label;
            if (!typeName) return;
            dispatch(
              updateClaimStatus({
                claimId: selectedClaim,
                statusId: parseInt(value),
                statusName: typeName,
              })
            );
            hideUpdateStatusModal();
          }}
        >
          <div className={gclasses.radioContainer}>
            {claimsStatus.map((value) => {
              return <Radio value={value.value} label={value.label} key={value.value} />;
            })}
          </div>
        </Radio.Group>
      </Modal>
    </Stack>
  );
};

export default Claims;

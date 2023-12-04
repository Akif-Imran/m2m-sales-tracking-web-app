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
import { removeClaim, updateStatusClaim } from "@thunks";

interface OwnProps {}

export const Claims: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR, token },
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
  const [selectedClaim, setSelectedClaim] = React.useState<string>("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = claims.filter(
      (request) =>
        request.lead?.name.toLowerCase().includes(query.toLowerCase()) ||
        request.supplier?.name?.toLowerCase().includes(query.toLowerCase()) ||
        request.requestByPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
        request.itemName?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  const showUpdateStatusModal = (statusId: number, requestId: string) => {
    setSelectedStatus(statusId.toString());
    setSelectedClaim(requestId);
    setVisible(true);
  };
  const hideUpdateStatusModal = () => setVisible(false);

  const handleDelete = (id: string) => {
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
        dispatch(
          removeClaim({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Claim", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteClaim(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete Claim: ", err?.message);
            notify("Delete Claim", "An error occurred", "error");
          });
        dispatch(deleteClaim(id));
        notify("Delete Claim", "Claim deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Claim", "Operation canceled!", "error"),
    });
  };

  const handleUpdateStatus = (value: string) => {
    if (!value) {
      notify("Update Claim Status", "Invalid status value", "error");
      return;
    }
    dispatch(
      updateStatusClaim({
        token,
        id: selectedClaim,
        body: {
          status: parseInt(value),
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Claim Status", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(updateClaimStatus(res.data));
          hideUpdateStatusModal();
        }
      })
      .catch((err) => {
        console.log("Update Claim Status: ", err?.message);
        notify("Update Claim Status", "An error occurred", "error");
      });
  };

  React.useEffect(() => {
    setSearchedData(claims);
  }, [claims]);

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Claims
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
            <tr key={request._id}>
              <td>{index + 1}</td>
              <td>{request.itemName}</td>
              <td>{request.itemType}</td>
              <td>
                {" "}
                <Badge variant="filled" color={claimStatusColors[request.status]}>
                  {request?.statusName}
                </Badge>
              </td>
              <td>{request.lead?.name}</td>
              <td>{request.requestByPerson?.name}</td>
              <td>
                {DateTime.fromISO(request.warranty).toLocal().toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
              </td>
              <td>{request.quantity}</td>
              <td>{request.supplier?.name}</td>
              <td>{value}</td>
              <td>{request.remarks}</td>
              <td>
                <Group>
                  {(isHR || isAdmin) && (
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(request.status, request._id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                  )}
                  {isAdmin && (
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(request._id)}>
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
        <Radio.Group value={selectedStatus} name="Update Status" onChange={handleUpdateStatus}>
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

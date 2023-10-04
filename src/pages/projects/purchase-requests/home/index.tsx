import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
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
import { _AddPurchaseRequestModal } from "../components";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { DAY_MM_DD_YYYY_HH_MM_SS_A, purchaseRequestStatusColors } from "@constants";
import { colors } from "@theme";
import { openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deletePurchaseRequest } from "@slices";
import { selectPurchaseRequestsWithRecords, useAppDispatch, useAppSelector } from "@store";
import { useAuthContext } from "@contexts";
import { useGStyles } from "@global-styles";
import { DateTime } from "luxon";

interface OwnProps {}

export const PurchaseRequests: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [searchQuery, setSearchQuery] = React.useState("");
  const requests = useAppSelector(selectPurchaseRequestsWithRecords);
  const [addRequestModalOpened, setAddRequestModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof requests>([]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin) {
      const filtered = requests.filter(
        (request) =>
          request.project?.name.toLowerCase().includes(query.toLowerCase()) ||
          request.supplier?.name?.toLowerCase().includes(query.toLowerCase()) ||
          request.requestByPerson?.firstName.toLowerCase().includes(query.toLowerCase()) ||
          request.requestByPerson?.lastName.toLowerCase().includes(query.toLowerCase()) ||
          request.itemName?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    } else {
      const filtered = requests.filter(
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

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Purchase Request`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Purchase Request? This action is destructive and you
          will have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Purchase Request",
      onConfirm: () => {
        dispatch(deletePurchaseRequest(id));
        notify("Delete Purchase Request", "Purchase Request deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Purchase Request", "Operation canceled!", "error"),
    });
  };

  React.useEffect(() => {
    if (isAdmin) {
      setSearchedData(requests);
    } else {
      const filtered = requests.filter((followup) => followup.requestedById === user?.id);
      setSearchedData(filtered);
    }
  }, [requests, isAdmin, user?.id]);

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
                <Badge variant="filled" color={purchaseRequestStatusColors[request.statusId]}>
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
                {isAdmin ? (
                  <Group>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(request.id)}>
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
            onClick={() => setAddRequestModalOpened(true)}
          >
            Purchase Request
          </Button>
        )}
      </Flex>
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={5}>Purchase Request</th>
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
      <_AddPurchaseRequestModal
        title="Add Purchase Request"
        opened={addRequestModalOpened}
        onClose={() => setAddRequestModalOpened(false)}
      />
    </Stack>
  );
};

export default PurchaseRequests;

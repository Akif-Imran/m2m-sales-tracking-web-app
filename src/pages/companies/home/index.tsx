import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useGStyles } from "../../../styles";
import {
  IconColumns2,
  IconId,
  IconPlus,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { selectCompanies, useAppDispatch, useAppSelector } from "@store";
import { colors } from "@theme";
import { _AddCompanyModal, _AddContactModal, _CompanyCard } from "../components";
import { openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteCompany } from "@slices";
import { useToggle } from "@mantine/hooks";
import { _AddFollowUpModal } from "../../prospects/follow-ups/components";
import { _AddClaimModal } from "../../prospects/claims/components";
import { _AddPurchaseRequestModal } from "../../projects/purchase-requests/components";
import { Outlet } from "react-router-dom";
import { removeCompany } from "@thunks";
import { useAuthContext } from "@contexts";
import { BASE_URL } from "@api";

interface OwnProps {}

const Company: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { token, isAdmin },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  // const [viewMode, toggle] = useToggle(["cards", "two-column", "list"]);
  const [viewMode, toggle] = useToggle(["cards", "list"]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: companies } = useAppSelector(selectCompanies);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);
  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);
  const [addClaimModalOpened, setAddClaimModalOpened] = React.useState(false);
  const [addPurchaseReqModalOpened, setAddPurchaseReqModalOpened] = React.useState(false);

  const [searchedData, setSearchedData] = React.useState<typeof companies>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<string>("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(companies);
  }, [companies]);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Contact`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Contact? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Contact",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(removeCompany({ id, token }))
          .unwrap()
          .then((res) => {
            notify("Delete Contact", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteCompany(res.data._id));
            }
          })
          .catch((err) => {
            console.log(err?.message);
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Contact", "Operation canceled!", "error"),
    });
  };

  const handleOpenContact = (companyId: string) => {
    setSelectedCompany(companyId);
    setAddContactModalOpened(true);
  };

  const handleOpenFollowUp = (companyId: string) => {
    setSelectedCompany(companyId);
    setAddFollowUpModalOpened(true);
  };

  const handleOpenExpense = (companyId: string) => {
    setSelectedCompany(companyId);
    setAddClaimModalOpened(true);
  };
  const handleOpenPurchaseRequest = (companyId: string) => {
    setSelectedCompany(companyId);
    setAddPurchaseReqModalOpened(true);
  };

  const noImageStyle = {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      filter: `invert(33%) sepia(65%) saturate(0%) hue-rotate(253deg) brightness(98%) contrast(88%)`,
      objectFit: "contain",
    },
  };

  let icon: JSX.Element;
  if (viewMode === "cards") {
    icon = <IconId size={22} color={colors.white} />;
  } else if (viewMode === "two-column") {
    icon = <IconColumns2 size={22} color={colors.white} />;
  } else {
    icon = <IconTable size={22} color={colors.white} />;
  }

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Companies
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((contact, index) => {
          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={contact._id}>
                <_CompanyCard
                  item={contact}
                  openContact={() => handleOpenContact(contact._id)}
                  openFollowUp={() => handleOpenFollowUp(contact._id)}
                  openExpense={() => handleOpenExpense(contact._id)}
                  openPurchaseRequest={() => handleOpenPurchaseRequest(contact._id)}
                  handleDelete={() => handleDelete(contact._id)}
                />
              </Grid.Col>
            );
          } else if (viewMode === "list") {
            return (
              <tr key={contact._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={contact?.logo ? `${BASE_URL}\\${contact?.logo}` : "/company.png"}
                    size={50}
                    //@ts-expect-error style works
                    styles={contact?.logo ? undefined : noImageStyle}
                  />
                </td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.address}</td>
                <td>{contact.city}</td>
                <td>{contact.state}</td>
                <td>{contact.country}</td>
                {isAdmin && (
                  <td>
                    <Group>
                      <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(contact._id)}>
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </td>
                )}
              </tr>
            );
          } else {
            return (
              <_CompanyCard
                item={contact}
                key={contact._id}
                openContact={() => handleOpenContact(contact._id)}
                openFollowUp={() => handleOpenFollowUp(contact._id)}
                openExpense={() => handleOpenExpense(contact._id)}
                openPurchaseRequest={() => handleOpenPurchaseRequest(contact._id)}
                handleDelete={() => handleDelete(contact._id)}
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
        <ScrollArea w={"160vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Contact</th>
                {/* <th colSpan={6}>Contact Person</th> */}
                <th colSpan={6}>Contact Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Name</th>
                <th>Email</th>

                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
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
          onClick={() => setAddCompanyModalOpened(true)}
        >
          Contact
        </Button>
      </Flex>
      {content}
      <_AddCompanyModal
        title="Add Contact"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      />
      <_AddContactModal
        title="Add Contact Person"
        opened={addContactModalOpened}
        companyId={selectedCompany}
        onClose={() => setAddContactModalOpened(false)}
      />
      <_AddFollowUpModal
        title="Add Follow Up"
        opened={addFollowUpModalOpened}
        companyId={selectedCompany}
        onClose={() => setAddFollowUpModalOpened(false)}
      />
      <_AddClaimModal
        title="Add Claim"
        opened={addClaimModalOpened}
        companyId={selectedCompany}
        onClose={() => setAddClaimModalOpened(false)}
      />
      <_AddPurchaseRequestModal
        title="Add Purchase Request"
        opened={addPurchaseReqModalOpened}
        companyId={selectedCompany}
        onClose={() => setAddPurchaseReqModalOpened(false)}
      />
    </Stack>
  );
};

export { Company };

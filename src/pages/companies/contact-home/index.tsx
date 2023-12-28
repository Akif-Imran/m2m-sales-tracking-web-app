import React from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useGStyles } from "../../../styles";
import {
  IconAddressBook,
  IconBuildingBank,
  IconColumns2,
  IconEdit,
  IconId,
  IconPlus,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { selectCompanies, selectContactsWithRecords, useAppDispatch, useAppSelector } from "@store";
import { colors } from "@theme";
import { _AddCompanyModal, _AddContactModal, _CompanyCard, _ContactCard } from "../components";
import { openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteCompany, deleteContact } from "@slices";
import { useToggle } from "@mantine/hooks";
import { _AddFollowUpModal } from "../../prospects/follow-ups/components";
import { _AddClaimModal } from "../../prospects/claims/components";
import { _AddPurchaseRequestModal } from "../../projects/purchase-requests/components";
import { Outlet } from "react-router-dom";
import { removeCompany, removeContact } from "@thunks";
import { useAuthContext } from "@contexts";
import { BASE_URL } from "@api";
import { excludedCompany } from "@constants";

interface OwnProps {}

export const Contact: React.FC<OwnProps> = () => {
  const {
    state: { token, isAdmin },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [viewMode, toggleViewMode] = useToggle(["cards", "list"]);
  const [recordType, toggleRecordType] = useToggle<"Contacts" | "Companies">([
    "Contacts",
    "Companies",
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: companies } = useAppSelector(selectCompanies);
  const contacts = useAppSelector(selectContactsWithRecords);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);
  const [editCompanyModalOpened, setEditCompanyModalOpened] = React.useState(false);
  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);
  const [addClaimModalOpened, setAddClaimModalOpened] = React.useState(false);
  const [addPurchaseReqModalOpened, setAddPurchaseReqModalOpened] = React.useState(false);

  const [searchedCompanyData, setSearchedCompanyData] = React.useState<typeof companies>([]);
  const [searchedContactData, setSearchedContactData] = React.useState<typeof contacts>([]);
  const [toDelete, setToDelete] = React.useState<string>("");
  const [selectedCompany, setSelectedCompany] = React.useState<string>("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (recordType === "Contacts") {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(query.toLocaleLowerCase())
      );
      setSearchedContactData(filtered);
    } else {
      const filtered = companies
        .filter((company) => company._id !== excludedCompany)
        .filter((company) => company.name.toLowerCase().includes(query.toLocaleLowerCase()));
      setSearchedCompanyData(filtered);
    }
  };

  React.useEffect(() => {
    setSearchedCompanyData(companies.filter((company) => company._id !== excludedCompany));
  }, [companies]);
  React.useEffect(() => {
    setSearchedContactData(contacts);
  }, [contacts]);

  const handleDeleteCompany = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Company`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Company? This action is destructive and you will have
          to company support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Company",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(removeCompany({ id, token }))
          .unwrap()
          .then((res) => {
            notify("Delete Company", res?.message, res.success ? "success" : "error");
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
      onCancel: () => notify("Delete Company", "Operation canceled!", "error"),
    });
  };

  const handleDeleteContact = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Contact? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        dispatch(
          removeContact({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Contact", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteContact(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete Contact: ", err?.message);
            notify("Delete Contact", "An error occurred", "error");
          });
      },
      onCancel: () => notify("Delete", "Operation canceled!", "error"),
    });
  };

  const handleOpenContact = (companyId: string) => {
    setToDelete(companyId);
    setAddContactModalOpened(true);
  };

  const handleOpenFollowUp = (companyId: string) => {
    setToDelete(companyId);
    setAddFollowUpModalOpened(true);
  };

  const handleOpenExpense = (companyId: string) => {
    setToDelete(companyId);
    setAddClaimModalOpened(true);
  };
  const handleOpenPurchaseRequest = (companyId: string) => {
    setToDelete(companyId);
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

  let viewModeIcon: JSX.Element;
  if (viewMode === "cards") {
    viewModeIcon = <IconId size={22} color={colors.white} />;
  } else if (viewMode === "two-column") {
    viewModeIcon = <IconColumns2 size={22} color={colors.white} />;
  } else {
    viewModeIcon = <IconTable size={22} color={colors.white} />;
  }

  let recordTypeIcon: JSX.Element;
  let actionButton: JSX.Element;
  if (recordType === "Contacts") {
    recordTypeIcon = <IconAddressBook size={22} color={colors.white} />;
    actionButton = (
      <Button
        variant="filled"
        rightIcon={<IconPlus size={16} />}
        onClick={() => setAddContactModalOpened(true)}
      >
        Contact
      </Button>
    );
  } else {
    recordTypeIcon = <IconBuildingBank size={22} color={colors.white} />;
    actionButton = (
      <Button
        variant="filled"
        rightIcon={<IconPlus size={16} />}
        onClick={() => setAddCompanyModalOpened(true)}
      >
        Company
      </Button>
    );
  }

  const companyRows =
    searchedCompanyData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Companies
        </td>
      </tr>
    ) : (
      <>
        {searchedCompanyData.map((company, index) => {
          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={company._id}>
                <_CompanyCard
                  item={company}
                  openContact={() => handleOpenContact(company._id)}
                  openFollowUp={() => handleOpenFollowUp(company._id)}
                  openExpense={() => handleOpenExpense(company._id)}
                  openPurchaseRequest={() => handleOpenPurchaseRequest(company._id)}
                  handleDelete={() => handleDeleteCompany(company._id)}
                />
              </Grid.Col>
            );
          } else if (viewMode === "list") {
            return (
              <tr key={company._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={company?.logo ? `${BASE_URL}\\${company?.logo}` : "/company.png"}
                    size={50}
                    //@ts-expect-error style works
                    styles={company?.logo ? undefined : noImageStyle}
                  />
                </td>
                <td>{company.name}</td>
                <td>{company?.registration || "N/A"}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>{company.address}</td>
                <td>{company.city}</td>
                <td>{company.state}</td>
                <td>{company.country}</td>
                <td>{company?.postalCode || "N/A"}</td>
                <td>
                  {isAdmin ? (
                    <Group>
                      <ActionIcon
                        size={"sm"}
                        onClick={() => {
                          setSelectedCompany(company._id);
                          setEditCompanyModalOpened(true);
                        }}
                      >
                        <IconEdit />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        size={"sm"}
                        onClick={() => handleDeleteCompany(company._id)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  ) : (
                    <Badge variant="light" color="red">
                      <Text>Admin Required</Text>
                    </Badge>
                  )}
                </td>
              </tr>
            );
          } else {
            return (
              <_CompanyCard
                item={company}
                key={company._id}
                openContact={() => handleOpenContact(company._id)}
                openFollowUp={() => handleOpenFollowUp(company._id)}
                openExpense={() => handleOpenExpense(company._id)}
                openPurchaseRequest={() => handleOpenPurchaseRequest(company._id)}
                handleDelete={() => handleDeleteCompany(company._id)}
              />
            );
          }
        })}
      </>
    );

  const contactRows =
    searchedContactData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Contacts
        </td>
      </tr>
    ) : (
      <>
        {searchedContactData.map((contact, index) => {
          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={contact._id}>
                <_ContactCard contact={contact} />
              </Grid.Col>
            );
          } else if (viewMode === "list") {
            return (
              <tr key={contact._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={
                      contact?.businessCard ? `${BASE_URL}\\${contact?.businessCard}` : "/user.png"
                    }
                    size={50}
                  />
                </td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.mobile.join(", ")}</td>
                <td>{contact.designation}</td>
                <td>{contact.designation}</td>
                <td>
                  {isAdmin ? (
                    <Group>
                      <ActionIcon
                        color="red"
                        size={"sm"}
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  ) : (
                    <Badge variant="light" color="red">
                      <Text>Admin Required</Text>
                    </Badge>
                  )}
                </td>
              </tr>
            );
          } else {
            return <_ContactCard contact={contact} />;
          }
        })}
      </>
    );

  let table: JSX.Element;
  if (recordType === "Contacts") {
    table = (
      <Table border={1} bgcolor={theme.white} withBorder>
        <thead>
          <tr>
            <th colSpan={4}>Contact</th>
            <th colSpan={4}>Contact Details</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>

            <th>Phone</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{contactRows}</tbody>
      </Table>
    );
  } else {
    table = (
      <Table border={1} bgcolor={theme.white} withBorder>
        <thead>
          <tr>
            <th colSpan={4}>Company</th>
            <th colSpan={6}>Company Details</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Registration No.</th>
            <th>Email</th>

            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Postal Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{companyRows}</tbody>
      </Table>
    );
  }

  let content: JSX.Element;
  if (viewMode === "cards") {
    content = <Grid columns={12}>{recordType === "Contacts" ? contactRows : companyRows}</Grid>;
  } else if (viewMode === "list") {
    content = (
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"160vw"}>{table}</ScrollArea>
      </ScrollArea>
    );
  } else {
    content = (
      <Grid>
        <Grid.Col span={4}>{recordType === "Contacts" ? contactRows : companyRows}</Grid.Col>
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

        <Tooltip label="Toggle Card / Table View" position="bottom" withArrow withinPortal>
          <ActionIcon
            variant="filled"
            size={"2.2rem"}
            color={theme.primaryColor}
            onClick={() => toggleViewMode()}
          >
            {viewModeIcon}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Toggle Companies / Contacts" position="bottom" withArrow withinPortal>
          <Button
            variant="filled"
            color={theme.primaryColor}
            rightIcon={recordTypeIcon}
            onClick={() => toggleRecordType()}
          >
            {recordType}
          </Button>
        </Tooltip>

        {actionButton}
      </Flex>
      {content}
      <_AddCompanyModal
        mode="add"
        title="Add Company"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      />
      <_AddCompanyModal
        mode="edit"
        title="Update Company"
        opened={editCompanyModalOpened}
        onClose={() => setEditCompanyModalOpened(false)}
        companyId={selectedCompany}
      />
      <_AddContactModal
        title="Add Contact"
        opened={addContactModalOpened}
        companyId={toDelete}
        onClose={() => setAddContactModalOpened(false)}
      />
      <_AddFollowUpModal
        title="Add Follow Up"
        opened={addFollowUpModalOpened}
        companyId={toDelete}
        onClose={() => setAddFollowUpModalOpened(false)}
      />
      <_AddClaimModal
        title="Add Claim"
        opened={addClaimModalOpened}
        companyId={toDelete}
        onClose={() => setAddClaimModalOpened(false)}
      />
      <_AddPurchaseRequestModal
        title="Add Purchase Request"
        opened={addPurchaseReqModalOpened}
        companyId={toDelete}
        onClose={() => setAddPurchaseReqModalOpened(false)}
      />
    </Stack>
  );
};

export default Contact;

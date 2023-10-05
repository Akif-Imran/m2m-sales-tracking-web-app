import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useGStyles } from "../../../styles";
import {
  IconColumns2,
  IconId,
  IconPlus,
  IconRotateClockwise2,
  IconSearch,
  IconTable,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";
import {
  selectCompaniesWithContact,
  selectCompanyContact,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { colors } from "@theme";
import { _AddCompanyModal, _AddContactModal, _CompanyCard } from "../components";
import { modalOverlayPropsHelper, openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { deleteCompany, updatePrimaryContact } from "@slices";
import { useToggle } from "@mantine/hooks";

interface OwnProps {}

const Company: React.FC<OwnProps> = () => {
  useStyles();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [viewMode, toggle] = useToggle(["cards", "two-column", "list"]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const companies = useAppSelector(selectCompaniesWithContact);
  const { data: contacts } = useAppSelector(selectCompanyContact);
  const [contactsList, setContactsList] = React.useState<{ value: string; label: string }[]>([]);

  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);
  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof companies>([]);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [selectedContact, setSelectedContact] = React.useState<number>(0);
  const [selectedCompany, setSelectedCompany] = React.useState<number>(0);

  const showPrimaryContactUpdateModal = (companyId: number) => {
    setSelectedCompany(companyId);
    setVisible(true);
  };
  const hideContactUpdateModal = () => setVisible(false);

  const updateContact = () => {
    const contact = contacts.find((contact) => contact.id === selectedContact);
    if (!contact) {
      notify("Update Contact", "Contact not found!", "error");
      return;
    }
    dispatch(updatePrimaryContact({ companyId: selectedCompany, contactId: contact.id }));
    notify("Update Contact", "Contact updated successfully!", "success");
    hideContactUpdateModal();
  };

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

  React.useEffect(() => {
    const contactsList = contacts
      .filter((contact) => contact.companyId === selectedCompany)
      .map((contact) => {
        return {
          value: contact.id.toString(),
          label: contact.name,
        };
      });
    setContactsList(contactsList);
  }, [contacts, selectedCompany]);

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Service`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Service? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Service",
      onConfirm: () => {
        dispatch(deleteCompany(id));
        notify("Delete Company", "Company deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Company", "Operation canceled!", "error"),
    });
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
        {searchedData.map((company, index) => {
          if (viewMode === "list") {
            return (
              <tr key={company.id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar src={company.logo} size={50} />
                </td>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company?.contact?.name}</td>
                <td>{company?.contact?.department}</td>
                <td>{company?.contact?.designation}</td>
                <td>{company?.contact?.email}</td>
                <td>{company?.contact?.phone}</td>
                <td>{company?.contact?.mobile}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>{company.address}</td>
                <td>{company.city}</td>
                <td>{company.country}</td>
                <td>
                  <Group>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showPrimaryContactUpdateModal(company.id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(company.id)}>
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            );
          } else if (viewMode === "cards") {
            return (
              <Grid.Col span={4}>
                <_CompanyCard item={company} key={company.id} onClick={() => {}} />
              </Grid.Col>
            );
          } else {
            return <div>{company.name}</div>;
          }
        })}
      </>
    );

  let content: JSX.Element;
  if (viewMode === "cards") {
    content = <Grid>{rows}</Grid>;
  } else if (viewMode === "list") {
    content = (
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"160vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Company</th>
                <th colSpan={6}>Contact Person</th>
                <th colSpan={6}>Company Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Id</th>
                <th>Name</th>

                <th>Name</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Phone</th>

                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
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
    content = <div>two column</div>;
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
          onClick={() => setAddCompanyModalOpened(true)}
        >
          Company
        </Button>
        <Button
          variant="filled"
          rightIcon={<IconUserPlus size={16} />}
          onClick={() => setAddContactModalOpened(true)}
        >
          Contact
        </Button>
      </Flex>
      {content}
      <_AddCompanyModal
        title="Add Company"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      />
      <_AddContactModal
        title="Add Contact"
        opened={addContactModalOpened}
        onClose={() => setAddContactModalOpened(false)}
      />
      <Modal
        centered
        radius="md"
        opened={visible}
        onClose={hideContactUpdateModal}
        title="Primary Contact"
        scrollAreaComponent={ScrollArea.Autosize}
        withinPortal
        withOverlay
        overlayProps={modalOverlayPropsHelper(theme)}
      >
        <Select
          required
          withinPortal
          searchable
          withAsterisk={false}
          nothingFound="No Companies"
          label="Company"
          value={selectedContact.toString()}
          onChange={(value) => {
            if (!value) return;
            setSelectedContact(parseInt(value));
          }}
          data={contactsList}
        />
        <Group align="flex-end" position="right" mt={rem(32)}>
          <Button variant="outline" onClick={() => hideContactUpdateModal()} size="xs">
            Cancel
          </Button>
          <Button variant="filled" onClick={() => updateContact()} size="xs">
            Save
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export { Company };

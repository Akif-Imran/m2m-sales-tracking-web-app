import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Card,
  Flex,
  Grid,
  Menu,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import {
  selectCompanies,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectLeadsWithRecords,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { DAY_MM_DD_YYYY, DAY_MM_DD_YYYY_HH_MM_SS_A, projectStatusColors } from "@constants";
import { useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { colors } from "@theme";
import {
  IconChevronRight,
  IconDotsVertical,
  IconFiles,
  IconPlus,
  IconSearch,
  IconTrashFilled,
} from "@tabler/icons-react";
import { _AddContactModal } from "../components";
import { _AddFollowUpModal } from "../../prospects/follow-ups/components";
import { _AddClaimModal } from "../../prospects/claims/components";
import { _AddPurchaseRequestModal } from "../../projects/purchase-requests/components";
import { _AddLeadModal } from "../../prospects/components";
import { removeCompany, removeContact } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { deleteCompany, deleteContact } from "@slices";
import { BASE_URL } from "@api";
import {
  useGStyles,
  menuIconStyle,
  cardConfig,
  titleTextStyle,
  bodyTextStyle,
  cardConfigWithoutHeight,
} from "@global-styles";
import { PhotoView } from "react-photo-view";
import { routes } from "@routes";

interface OwnProps {}
type ArrayToObj<T extends Array<Record<string, unknown>>> = T extends Array<infer U> ? U : never;

export const CompanyProspects: React.FC<OwnProps> = () => {
  const { theme } = useStyles();
  const navigate = useNavigate();
  const { classes: gclasses } = useGStyles();
  const { companyId, prospectId } = useParams();
  console.log(companyId);
  const dispatch = useAppDispatch();
  const {
    state: { token, user, isAdmin },
  } = useAuthContext();
  const followUpList = useAppSelector(selectFollowUpsWithRecords);
  const prospects = useAppSelector(selectLeadsWithRecords);
  const { data: companies } = useAppSelector(selectCompanies);
  const { data: contacts } = useAppSelector(selectCompanyContact);

  const [isDeletingContact, setIsDeletingContact] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [company, setCompany] = React.useState<ICompany>();
  const [contactsList, setContactsList] = React.useState<typeof contacts>([]);
  const [followUpsList, setFollowUpsList] = React.useState<typeof followUpList>([]);
  const [prospectsList, setProspectsList] = React.useState<typeof prospects>([]);
  const [searchedProspects, setSearchedProspects] = React.useState<typeof prospects>([]);

  const [selectedLead, setSelectedLead] = React.useState<ArrayToObj<typeof prospects>>();

  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [addProspectModalOpened, setAddProspectModalOpened] = React.useState(false);
  const [addClaimModalOpened, setAddClaimModalOpened] = React.useState(false);
  const [addPurchaseModalOpened, setAddPurchaseModalOpened] = React.useState(false);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);

  const [contactSearchQuery, setContactSearchQuery] = React.useState("");
  const [prospectSearchQuery, setProspectSearchQuery] = React.useState("");
  const [followupSearchQuery, setFollowUpSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (!companyId) return;
    const company = companies.find((company) => company._id === companyId);
    const prospect_s = prospects.filter((project) => project.customerId === companyId);
    const contact_s = contacts.filter((contact) => contact.customerId === companyId);
    setContactsList(contact_s);
    setProspectsList(prospect_s);
    setSearchedProspects(prospect_s);
    setCompany(company);
    if (prospect_s.length > 0) {
      if (prospectId) {
        const prospect = prospect_s.find((lead) => lead._id === prospectId);
        if (prospect) {
          setSelectedLead(prospect);
          setFollowUpsList(followUpList.filter((followUp) => followUp.projectId === prospect._id));
        } else {
          setSelectedLead(prospect_s[0]);
          setFollowUpsList(
            followUpList.filter((followUp) => followUp.projectId === prospect_s[0]._id)
          );
        }
      } else {
        setSelectedLead(prospect_s[0]);
        setFollowUpsList(
          followUpList.filter((followUp) => followUp.projectId === prospect_s[0]._id)
        );
      }
    }
    setIsLoading((_prev) => false);
  }, [companyId, prospectId, companies, prospects, contacts, followUpList]);

  const handleSelectProspect = (prospectId: string) => {
    const project = prospects.find((project) => project._id === prospectId);
    setSelectedLead(project);
    //FIXME - fix this follow project id type
    const followUp_s = followUpList.filter((followUp) => followUp.projectId === prospectId);
    setFollowUpsList(followUp_s);
  };

  const handleDeleteCompany = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Company`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Company? This action is destructive and you will have
          to company support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Company",
      onConfirm: () => {
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
          });
      },
      onCancel: () => notify("Delete Company", "Operation canceled!", "error"),
    });
  };

  const handleDeleteContact = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete`,
      loading: isDeletingContact,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Contact Person? This action is destructive and you
          will have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        setIsDeletingContact((_prev) => true);
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
          })
          .finally(() => {
            setIsDeletingContact((_prev) => false);
          });
      },
      onCancel: () => notify("Delete", "Operation canceled!", "error"),
    });
  };

  const onChangeContactSearch = (query: string) => {
    setContactSearchQuery(query);
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()) && contact.customerId === companyId
    );
    setContactsList(filtered);
  };

  const onChangeProspectSearch = (query: string) => {
    setProspectSearchQuery(query);
    const filtered = prospectsList.filter((prospect) =>
      prospect.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedProspects(filtered);
  };

  const onChangeFollowUpSearch = (query: string) => {
    setFollowUpSearchQuery(query);
    const filtered = followUpList
      .filter((followUp) => followUp.projectId === selectedLead?._id)
      .filter(
        (followUp, index) =>
          `${index + 1}`.toLowerCase().includes(query.toLowerCase()) ||
          followUp.contactPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
          followUp.meetingPlace.toLowerCase().includes(query.toLowerCase())
      );
    setFollowUpsList(filtered);
  };
  //  } else if (!company || !selectedProject) {
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!company) {
    return <center>No such company exits...</center>;
  } else {
    return (
      <>
        <Card {...cardConfigWithoutHeight}>
          <Flex direction={"row"} justify={"space-between"} align={"center"} w={"100%"}>
            <Text {...titleTextStyle} size={"xl"} align="center"></Text>
            <Text {...titleTextStyle} size={"xl"} align="center">
              {company?.name}
            </Text>

            <Menu withArrow withinPortal position="right-start">
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical size={16} stroke={1.3} color={colors.titleText} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>New</Menu.Label>
                <Menu.Item
                  color={colors.titleText}
                  icon={<IconPlus {...menuIconStyle} />}
                  onClick={() => setAddProspectModalOpened(true)}
                >
                  Prospect
                </Menu.Item>
                <Menu.Item
                  color={colors.titleText}
                  icon={<IconPlus {...menuIconStyle} />}
                  onClick={() => setAddClaimModalOpened(true)}
                >
                  Expense / Claim
                </Menu.Item>
                <Menu.Label>Options</Menu.Label>
                <Menu.Item
                  c={colors.titleText}
                  icon={<IconFiles {...menuIconStyle} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routes.reports.list_nav(company?._id));
                  }}
                >
                  Reports
                </Menu.Item>
                {isAdmin && (
                  <Menu.Item
                    color="red"
                    icon={<IconTrashFilled size={menuIconStyle.size} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteCompany(company?._id);
                    }}
                  >
                    Delete
                  </Menu.Item>
                )}
                {/* TODO - in Project Management module */}
                {/* <Menu.Item
                      color={colors.titleText}
                      icon={<IconShoppingBag {...menuIconStyle} />}
                      onClick={() => setAddPurchaseModalOpened(true)}
                    >
                      Purchase Request
                    </Menu.Item> */}
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Card>
        <Grid>
          <Grid.Col span={3}>
            <Card {...cardConfigWithoutHeight} h={rem(56)}>
              {/* <Text {...titleTextStyle} size={"md"} mt={rem(4)}>
                Prospects
              </Text> */}
              <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <Text {...titleTextStyle} size={"md"}>
                  Prospects
                </Text>

                <Flex direction={"row"} columnGap={"xs"} align={"center"}>
                  <TextInput
                    size="xs"
                    radius={"md"}
                    value={prospectSearchQuery}
                    className={gclasses.searchInput}
                    placeholder="Search by any field"
                    icon={<IconSearch size={16} />}
                    onChange={(e) => onChangeProspectSearch(e.target?.value)}
                  />
                  <ActionIcon
                    variant="filled"
                    size={"sm"}
                    color={"dark"}
                    onClick={() => setAddProspectModalOpened(true)}
                  >
                    <IconPlus size={16} stroke={1.3} color={colors.white} />
                  </ActionIcon>
                </Flex>
              </Flex>
            </Card>
            <ScrollArea type="scroll" h={"80vh"}>
              {searchedProspects.map((project) => {
                return (
                  <Card
                    key={project._id}
                    shadow="sm"
                    mb={"xs"}
                    px={"sm"}
                    py={"xs"}
                    radius={"md"}
                    onClick={() => handleSelectProspect(project._id)}
                  >
                    <Flex direction={"row"} justify={"space-between"} align={"center"}>
                      <Flex direction={"column"} align={"flex-start"}>
                        <Text {...titleTextStyle}>{project.name}</Text>
                        <Badge variant="filled" color={projectStatusColors[project.status]}>
                          {project?.statusName}
                        </Badge>
                      </Flex>
                      {selectedLead?._id === project._id && (
                        <IconChevronRight size={24} color={colors.titleText} />
                      )}
                    </Flex>
                  </Card>
                );
              })}
            </ScrollArea>
          </Grid.Col>

          <Grid.Col span={9}>
            <Stack spacing={"xs"}>
              <Grid>
                <Grid.Col span={7}>
                  <Card {...cardConfigWithoutHeight} h={rem(56)}>
                    <Stack spacing={"xs"}>
                      <Flex direction={"row"} align={"center"} mt={rem(4)}>
                        <Text {...titleTextStyle} size={"md"}>
                          Details
                        </Text>
                        {selectedLead?.status && (
                          <Badge
                            ml={"lg"}
                            variant="filled"
                            color={projectStatusColors[selectedLead?.status]}
                          >
                            {selectedLead?.statusName}
                          </Badge>
                        )}
                      </Flex>
                    </Stack>
                  </Card>
                  {selectedLead && (
                    <Card {...cardConfig}>
                      <Flex direction={"column"}>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Name: </Text>
                          <Text {...bodyTextStyle}>{selectedLead?.name || "N/A"}</Text>
                        </Flex>
                        <Flex direction={"row"} align={"center"} justify={"space-between"}>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Type: </Text>
                            <Text {...bodyTextStyle}>{selectedLead?.type || "N/A"}</Text>
                          </Flex>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Salesman: </Text>
                            <Text {...bodyTextStyle}>
                              {selectedLead?.salesPerson
                                ? selectedLead?.salesPerson === user?._id
                                  ? "(You)"
                                  : selectedLead?.salesPersonValue?.name
                                : "N/A"}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex direction={"row"} align={"center"} justify={"space-between"}>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Value: </Text>
                            <Text {...bodyTextStyle}>
                              {selectedLead?.value
                                ? Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: selectedLead?.value.currency,
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  }).format(selectedLead?.value.amount)
                                : "N/A"}
                            </Text>
                          </Flex>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Contract Date: </Text>
                            <Text {...bodyTextStyle}>
                              {selectedLead?.contractDate
                                ? DateTime.fromISO(selectedLead?.contractDate).toFormat(
                                    DAY_MM_DD_YYYY
                                  )
                                : "N/A"}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex direction={"row"} align={"center"} justify={"space-between"}>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Quotation: </Text>
                            <Text {...bodyTextStyle}>{selectedLead?.quotation || "N/A"}</Text>
                          </Flex>
                          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                            <Text {...titleTextStyle}>Delivery Date: </Text>
                            <Text {...bodyTextStyle}>
                              {selectedLead?.deliveryDate
                                ? DateTime.fromISO(selectedLead?.deliveryDate).toFormat(
                                    DAY_MM_DD_YYYY
                                  )
                                : "N/A"}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Description: </Text>
                          <Text {...bodyTextStyle}>{selectedLead?.description || "N/A"}</Text>
                        </Flex>
                      </Flex>
                    </Card>
                  )}
                </Grid.Col>

                <Grid.Col span={5}>
                  <Card {...cardConfigWithoutHeight} h={rem(56)}>
                    <Flex direction={"row"} justify={"space-between"} align={"center"}>
                      <Text {...titleTextStyle} size={"md"}>
                        Contacts
                      </Text>

                      <Flex direction={"row"} columnGap={"xs"} align={"center"}>
                        <TextInput
                          size="xs"
                          radius={"md"}
                          value={contactSearchQuery}
                          className={gclasses.searchInput}
                          placeholder="Search by any field"
                          icon={<IconSearch size={16} />}
                          onChange={(e) => onChangeContactSearch(e.target?.value)}
                        />
                        <ActionIcon
                          variant="filled"
                          size={"sm"}
                          color={"dark"}
                          onClick={() => setAddContactModalOpened(true)}
                        >
                          <IconPlus size={16} stroke={1.3} color={colors.white} />
                        </ActionIcon>
                      </Flex>
                    </Flex>
                  </Card>
                  <ScrollArea type="scroll" h={"36vh"}>
                    {contactsList.map((contact) => {
                      return (
                        <Card {...cardConfig}>
                          <React.Fragment key={contact._id}>
                            <Flex
                              direction={"row"}
                              justify={"flex-start"}
                              align={"flex-start"}
                              columnGap={"sm"}
                              // style={{ border: "1px solid black" }}
                            >
                              <Flex my={"auto"}>
                                <PhotoView
                                  key={contact._id}
                                  src={
                                    contact.businessCard
                                      ? `${BASE_URL}\\${contact.businessCard}`
                                      : "/user.png"
                                  }
                                >
                                  <Avatar
                                    src={
                                      contact.businessCard
                                        ? `${BASE_URL}\\${contact.businessCard}`
                                        : "/user.png"
                                    }
                                    size={88}
                                  />
                                </PhotoView>
                              </Flex>
                              <Flex direction={"column"} w={"100%"}>
                                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                                  <Flex
                                    direction={"row"}
                                    align={"flex-start"}
                                    justify={"flex-start"}
                                  >
                                    <Text {...titleTextStyle} mr={"xs"}>
                                      Name:
                                    </Text>
                                    <Text {...bodyTextStyle}>{contact?.name || "N/A"}</Text>
                                  </Flex>
                                  <Menu withinPortal withArrow position="bottom-end">
                                    <Menu.Target>
                                      <ActionIcon>
                                        <IconDotsVertical
                                          size={16}
                                          stroke={1.3}
                                          color={colors.titleText}
                                        />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Label>Options</Menu.Label>
                                      <Menu.Item
                                        color="red"
                                        icon={<IconTrashFilled stroke={1.3} size={16} />}
                                        onClick={() => handleDeleteContact(contact._id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                </Flex>
                                <Flex direction={"row"} align={"center"} justify={"flex-start"}>
                                  <Text {...titleTextStyle} mr={"xs"}>
                                    Email:
                                  </Text>
                                  <Anchor
                                    {...bodyTextStyle}
                                    href={contact?.email}
                                    target={"_blank"}
                                    c={"blue"}
                                  >
                                    {contact?.email || "N/A"}
                                  </Anchor>
                                </Flex>
                                <Flex direction={"row"} align={"center"} justify={"flex-start"}>
                                  <Text {...titleTextStyle} mr={"xs"}>
                                    Designation:
                                  </Text>
                                  <Text {...bodyTextStyle}>{contact?.designation || "N/A"}</Text>
                                </Flex>
                                <Flex direction={"row"} align={"center"} justify={"flex-start"}>
                                  <Text {...titleTextStyle} mr={"xs"}>
                                    Department:
                                  </Text>
                                  <Text {...bodyTextStyle}>{contact?.department || "N/A"}</Text>
                                </Flex>
                                <Flex direction={"row"} align={"flex-start"} justify={"flex-start"}>
                                  <Text {...titleTextStyle} mr={"xs"}>
                                    Mobile:
                                  </Text>
                                  <Text {...bodyTextStyle}>{contact?.mobile || "N/A"}</Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          </React.Fragment>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </Grid.Col>
              </Grid>

              <div>
                <Card {...cardConfigWithoutHeight} h={rem(56)}>
                  <Flex direction={"row"} justify={"space-between"} align={"center"}>
                    <Text {...titleTextStyle} size={"md"}>
                      Meetings / Follow Up:
                    </Text>
                    <Flex direction={"row"} columnGap={"xs"} align={"center"}>
                      <TextInput
                        miw={"24vw"}
                        size="xs"
                        radius={"md"}
                        value={followupSearchQuery}
                        className={gclasses.searchInput}
                        placeholder="Search by contact, place, No."
                        icon={<IconSearch size={16} />}
                        onChange={(e) => onChangeFollowUpSearch(e.target?.value)}
                      />
                      <ActionIcon
                        variant="filled"
                        size={"sm"}
                        color={"dark"}
                        onClick={() => setAddFollowUpModalOpened(true)}
                      >
                        <IconPlus size={16} stroke={1.3} color={colors.white} />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                </Card>
                <ScrollArea type="scroll" h={"33vh"}>
                  {followUpsList.map((followUp, index) => {
                    const value = followUp?.expensePrice
                      ? Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: followUp.expensePrice.currency,
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        }).format(followUp.expensePrice.amount)
                      : "N/A";

                    return (
                      <Card {...cardConfig} key={followUp._id}>
                        <React.Fragment>
                          <Flex direction={"row"} justify={"space-between"}>
                            <Flex direction={"column"} my={"md"}>
                              <Text {...titleTextStyle} mb={"xs"}>
                                #{index + 1}
                              </Text>
                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Date/Time: </Text>
                                <Text {...bodyTextStyle}>
                                  {DateTime.fromISO(followUp.meetingDate).toFormat(
                                    DAY_MM_DD_YYYY_HH_MM_SS_A
                                  )}
                                </Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Location:</Text>
                                <Text {...bodyTextStyle}>{followUp.meetingPlace}</Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Meeting With:</Text>
                                <Text {...bodyTextStyle}>{followUp.contactPerson?.name}</Text>
                              </Flex>

                              <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Agenda:</Text>
                                <Text {...bodyTextStyle}>{followUp.meetingAgenda}</Text>
                              </Flex>

                              <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Summary:</Text>
                                <Text {...bodyTextStyle}>{followUp.meetingSummary}</Text>
                              </Flex>
                            </Flex>

                            <Flex direction={"column"} my={"md"}>
                              <Text {...titleTextStyle} mb={"xs"}>
                                Next Visit
                              </Text>
                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Date/Time: </Text>
                                <Text {...bodyTextStyle}>
                                  {followUp.nextMeetingDate
                                    ? DateTime.fromISO(followUp.nextMeetingDate).toFormat(
                                        DAY_MM_DD_YYYY_HH_MM_SS_A
                                      )
                                    : "---"}
                                </Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Agenda:</Text>
                                <Text {...bodyTextStyle}>{followUp.nextMeetingAgenda}</Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Place:</Text>
                                <Text {...bodyTextStyle}>{followUp.nextMeetingPlace}</Text>
                              </Flex>
                            </Flex>

                            <Flex direction={"column"} my={"md"}>
                              <Text {...titleTextStyle} mb={"xs"}>
                                Expense / Claim
                              </Text>
                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Name:</Text>
                                <Text {...bodyTextStyle}>{followUp?.expenseName}</Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Type:</Text>
                                <Text {...bodyTextStyle}>
                                  {followUp?.expenseTypeDetail?.name || "---"}
                                </Text>
                              </Flex>

                              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                                <Text {...titleTextStyle}>Price:</Text>
                                <Text {...bodyTextStyle}>{value}</Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </React.Fragment>
                      </Card>
                    );
                  })}
                </ScrollArea>
              </div>
            </Stack>
          </Grid.Col>
        </Grid>
        <_AddLeadModal
          title="Add Prospect"
          opened={addProspectModalOpened}
          onClose={() => setAddProspectModalOpened(false)}
          companyId={company._id}
        />
        <_AddContactModal
          title="Add Contact"
          opened={addContactModalOpened}
          companyId={company._id}
          onClose={() => setAddContactModalOpened(false)}
        />
        <_AddFollowUpModal
          title="Add Follow Up"
          opened={addFollowUpModalOpened}
          projectId={selectedLead?._id}
          companyId={company._id}
          onClose={() => setAddFollowUpModalOpened(false)}
        />
        <_AddClaimModal
          title="Add Claim"
          opened={addClaimModalOpened}
          companyId={company._id}
          projectId={selectedLead?._id}
          onClose={() => setAddClaimModalOpened(false)}
        />
        <_AddPurchaseRequestModal
          title="Add Purchase Request"
          opened={addPurchaseModalOpened}
          companyId={company._id}
          projectId={selectedLead?._id}
          onClose={() => setAddPurchaseModalOpened(false)}
        />
      </>
    );
  }
};

export default CompanyProspects;

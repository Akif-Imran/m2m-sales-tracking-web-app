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
} from "@mantine/core";
import {
  selectCompanies,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectLeadsWithRecords,
  selectProjectsWithRecords,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { DAY_MM_DD_YYYY, DAY_MM_DD_YYYY_HH_MM_SS_A, projectStatusColors } from "@constants";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { colors } from "@theme";
import {
  IconBriefcase,
  IconCash,
  IconChevronRight,
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconTrashFilled,
} from "@tabler/icons-react";
import { _AddContactModal } from "../components";
import { _AddFollowUpModal } from "../../prospects/follow-ups/components";
import { _AddClaimModal } from "../../prospects/claims/components";
import { _AddPurchaseRequestModal } from "../../projects/purchase-requests/components";
import { _AddLeadModal } from "../../prospects/components";
import { removeContact } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { deleteContact } from "@slices";
import { BASE_URL } from "@api";
import { useGStyles, menuIconStyle } from "@global-styles";
import { PhotoView } from "react-photo-view";

interface OwnProps {}
type ArrayToObj<T extends Array<Record<string, unknown>>> = T extends Array<infer U> ? U : never;

export const CompanyProjects: React.FC<OwnProps> = () => {
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const { companyId } = useParams();
  console.log(companyId);
  const dispatch = useAppDispatch();
  const {
    state: { token, user },
  } = useAuthContext();
  const followUpList = useAppSelector(selectFollowUpsWithRecords);
  const leadsList = useAppSelector(selectLeadsWithRecords);
  const projectsList = useAppSelector(selectProjectsWithRecords);
  const { data: companiesList } = useAppSelector(selectCompanies);
  const { data: contactsList } = useAppSelector(selectCompanyContact);

  const [isDeletingContact, setIsDeletingContact] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [company, setCompany] = React.useState<ICompany>();
  const [projectLeadsList, setProjectsLeadList] = React.useState<typeof leadsList>([]);
  const [contacts, setContacts] = React.useState<typeof contactsList>([]);
  const [followUps, setFollowUps] = React.useState<typeof followUpList>([]);
  const [selectedProject, setSelectedProject] = React.useState<ArrayToObj<typeof leadsList>>();

  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [addProjectModalOpened, setAddProjectModalOpened] = React.useState(false);
  const [addClaimModalOpened, setAddClaimModalOpened] = React.useState(false);
  const [addPurchaseModalOpened, setAddPurchaseModalOpened] = React.useState(false);
  const [contactSearchQuery, setContactSearchQuery] = React.useState("");
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);
  const [followupSearchQuery, setFollowUpSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (!companyId) return;
    const company = companiesList.find((company) => company._id === companyId);
    const project_s = leadsList
      .concat(projectsList)
      .filter((project) => project.customerId === companyId);
    const contact_s = contactsList.filter((contact) => contact.customerId === companyId);
    setContacts(contact_s);
    setProjectsLeadList(project_s);
    setCompany(company);
    if (project_s.length > 0) {
      setSelectedProject(project_s[0]);
      setFollowUps(followUpList.filter((followUp) => followUp.projectId === project_s[0]._id));
    }
    setIsLoading(false);
  }, [companyId, companiesList, leadsList, contactsList, followUpList, projectsList]);

  const handleSelectProject = (projectId: string) => {
    const project = leadsList.concat(projectsList).find((project) => project._id === projectId);
    setSelectedProject(project);
    //FIXME - fix this follow project id type
    const followUp_s = followUpList.filter((followUp) => followUp.projectId === projectId);
    setFollowUps(followUp_s);
  };

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete`,
      loading: isDeletingContact,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Contact? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => handleDeleteContact(id),
      onCancel: () => notify("Delete", "Operation canceled!", "error"),
    });
  };

  const handleDeleteContact = (id: string) => {
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
  };

  const onChangeContactSearch = (query: string) => {
    setContactSearchQuery(query);
    const filtered = contactsList.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()) && contact.customerId === companyId
    );
    setContacts(filtered);
  };

  const onChangeFollowUpSearch = (query: string) => {
    setFollowUpSearchQuery(query);
    const filtered = followUpList
      .filter((followUp) => followUp.projectId === selectedProject?._id)
      .filter(
        (followUp, index) =>
          `${index + 1}`.toLowerCase().includes(query.toLowerCase()) ||
          followUp.contactPerson?.name.toLowerCase().includes(query.toLowerCase()) ||
          followUp.meetingPlace.toLowerCase().includes(query.toLowerCase())
      );
    setFollowUps(filtered);
  };

  const titleTextStyle = {
    fw: 700,
    c: colors.titleText,
    size: "sm",
  };
  const bodyTextStyle = {
    fz: "sm",
    color: colors.titleText,
  };

  const cardConfig = {
    shadow: "sm",
    mb: "xs",
    px: "sm",
    py: "xs",
    radius: "md",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!company || !selectedProject) {
    return <center>Nothing to see here...</center>;
  } else {
    return (
      <>
        <Grid>
          <Grid.Col span={3}>
            <Card {...cardConfig}>
              <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <Text {...titleTextStyle} size={"lg"}>
                  Leads/Projects List
                </Text>

                <Menu withArrow withinPortal>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDotsVertical size={16} stroke={1.3} color={colors.titleText} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>New</Menu.Label>
                    <Menu.Item
                      color={colors.titleText}
                      icon={<IconBriefcase {...menuIconStyle} />}
                      onClick={() => setAddProjectModalOpened(true)}
                    >
                      Prospect
                    </Menu.Item>
                    <Menu.Item
                      color={colors.titleText}
                      icon={<IconCash {...menuIconStyle} />}
                      onClick={() => setAddClaimModalOpened(true)}
                    >
                      Expense / Claim
                    </Menu.Item>
                    <Menu.Item
                      color={colors.titleText}
                      icon={<IconShoppingBag {...menuIconStyle} />}
                      onClick={() => setAddPurchaseModalOpened(true)}
                    >
                      Purchase Request
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Card>
            <ScrollArea type="scroll" h={"80vh"}>
              {projectLeadsList.map((project) => {
                return (
                  <Card
                    key={project._id}
                    shadow="sm"
                    mb={"xs"}
                    px={"sm"}
                    py={"xs"}
                    radius={"md"}
                    onClick={() => handleSelectProject(project._id)}
                  >
                    <Flex direction={"row"} justify={"space-between"} align={"center"}>
                      <Flex direction={"column"} align={"flex-start"}>
                        <Text {...titleTextStyle}>{project.name}</Text>
                        <Badge variant="filled" color={projectStatusColors[project.status]}>
                          {project?.statusName}
                        </Badge>
                      </Flex>
                      {selectedProject._id === project._id && (
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
                  <Card {...cardConfig}>
                    <Stack spacing={"xs"}>
                      <Flex direction={"row"} align={"center"}>
                        <Text {...titleTextStyle} size={"lg"}>
                          Details
                        </Text>
                        <Badge
                          ml={"lg"}
                          variant="filled"
                          color={projectStatusColors[selectedProject.status]}
                        >
                          {selectedProject.statusName}
                        </Badge>
                      </Flex>
                    </Stack>
                  </Card>
                  <Card {...cardConfig}>
                    <Flex direction={"column"}>
                      <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                        <Text {...titleTextStyle}>Name: </Text>
                        <Text {...bodyTextStyle}>{selectedProject.name}</Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Type: </Text>
                          <Text {...bodyTextStyle}>{selectedProject.type}</Text>
                        </Flex>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Salesman: </Text>
                          <Text {...bodyTextStyle}>
                            {selectedProject.salesPerson === user?._id
                              ? "(You)"
                              : selectedProject.salesPersonValue?.name}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Value: </Text>
                          <Text {...bodyTextStyle}>
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: selectedProject.value.currency,
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            }).format(selectedProject.value.amount)}
                          </Text>
                        </Flex>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Contract Date: </Text>
                          <Text {...bodyTextStyle}>
                            {DateTime.fromISO(selectedProject.contractDate).toFormat(
                              DAY_MM_DD_YYYY
                            )}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Quotation: </Text>
                          <Text {...bodyTextStyle}>{selectedProject.quotation}</Text>
                        </Flex>
                        <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                          <Text {...titleTextStyle}>Delivery Date: </Text>
                          <Text {...bodyTextStyle}>
                            {" "}
                            {DateTime.fromISO(selectedProject.deliveryDate).toFormat(
                              DAY_MM_DD_YYYY
                            )}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                        <Text {...titleTextStyle}>Description: </Text>
                        <Text {...bodyTextStyle}>{selectedProject.description}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Grid.Col>

                <Grid.Col span={5}>
                  <Card {...cardConfig}>
                    <Flex direction={"row"} justify={"space-between"} align={"center"}>
                      <Text {...titleTextStyle} size={"lg"}>
                        Contact Persons
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
                    {contacts.map((contact) => {
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
                                  <Flex direction={"row"} align={"center"} justify={"flex-start"}>
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
                                        onClick={() => handleDelete(contact._id)}
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
                                    Mobile No.:
                                  </Text>
                                  <Text {...bodyTextStyle}>{contact?.mobile || "N/A"}</Text>
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
                <Card {...cardConfig}>
                  <Flex direction={"row"} justify={"space-between"} align={"center"}>
                    <Text {...titleTextStyle} size={"lg"}>
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
                  {followUps.map((followUp, index) => {
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
          title="Add Lead/Project"
          opened={addProjectModalOpened}
          onClose={() => setAddProjectModalOpened(false)}
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
          projectId={selectedProject._id}
          companyId={company._id}
          onClose={() => setAddFollowUpModalOpened(false)}
        />
        <_AddClaimModal
          title="Add Claim"
          opened={addClaimModalOpened}
          companyId={company._id}
          projectId={selectedProject._id}
          onClose={() => setAddClaimModalOpened(false)}
        />
        <_AddPurchaseRequestModal
          title="Add Purchase Request"
          opened={addPurchaseModalOpened}
          companyId={company._id}
          projectId={selectedProject._id}
          onClose={() => setAddPurchaseModalOpened(false)}
        />
      </>
    );
  }
};

export default CompanyProjects;

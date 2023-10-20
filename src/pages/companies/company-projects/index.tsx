import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Anchor,
  Badge,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Menu,
  ScrollArea,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  selectCompanies,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectProjectWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { DAY_MM_DD_YYYY, DAY_MM_DD_YYYY_HH_MM_SS_A, projectStatusColors } from "@constants";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { colors } from "@theme";
import { IconChevronRight, IconDotsVertical, IconPlus, IconTrashFilled } from "@tabler/icons-react";
import { _AddContactModal } from "../components";
import { _AddFollowUpModal } from "../../projects/follow-ups/components";
import { removeContact } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { deleteContact } from "@slices";

interface OwnProps {}
type ArrayToObj<T extends Array<Record<string, unknown>>> = T extends Array<infer U> ? U : never;

export const CompanyProjects: React.FC<OwnProps> = () => {
  const { theme } = useStyles();
  const { companyId } = useParams();
  console.log(companyId);
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const followUpList = useAppSelector(selectFollowUpsWithRecords);
  const projectsList = useAppSelector(selectProjectWithRecords);
  const { projectStatus: projectStatusList } = useAppSelector(selectRecordsForDropdown);
  const { data: companiesList } = useAppSelector(selectCompanies);
  const { data: contactsList } = useAppSelector(selectCompanyContact);

  const [isDeletingContact, setIsDeletingContact] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [company, setCompany] = React.useState<ICompany>();
  const [projects, setProjects] = React.useState<typeof projectsList>([]);
  const [contacts, setContacts] = React.useState<typeof contactsList>([]);
  const [followUps, setFollowUps] = React.useState<typeof followUpList>([]);
  const [selectedProject, setSelectedProject] = React.useState<ArrayToObj<typeof projectsList>>();

  const [addContactModalOpened, setAddContactModalOpened] = React.useState(false);
  const [addFollowUpModalOpened, setAddFollowUpModalOpened] = React.useState(false);

  React.useEffect(() => {
    if (!companyId) return;
    const company = companiesList.find((company) => company._id === companyId);
    const project_s = projectsList.filter((project) => project.customerId === companyId);
    const contact_s = contactsList.filter((contact) => contact.customerId === companyId);
    setContacts(contact_s);
    setProjects(project_s);
    setCompany(company);
    if (project_s.length > 0) {
      setSelectedProject(project_s[0]);
      setFollowUps(followUpList.filter((followUp) => followUp.projectId === project_s[0]._id));
    }
    setIsLoading(false);
  }, [companyId, companiesList, projectsList, contactsList, followUpList]);

  const handleSelectProject = (projectId: string) => {
    const project = projectsList.find((project) => project._id === projectId);
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

  const titleTextStyle = {
    fw: 700,
    c: colors.titleText,
    size: "sm",
  };
  const bodyTextStyle = {
    fz: "sm",
    color: colors.titleText,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!company || !selectedProject) {
    return <div>Nothing to see here...</div>;
  } else {
    return (
      <>
        <Grid>
          <Grid.Col span={3}>
            <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
              <Center>
                <Text {...titleTextStyle} size={"lg"}>
                  Leads/Projects List
                </Text>
              </Center>
            </Card>
            <ScrollArea type="scroll" h={"96vh"}>
              {projects.map((project) => {
                const status = projectStatusList.find(
                  (status) => status.value === project.status.toString()
                );
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
                      <Flex direction={"column"}>
                        <Text {...titleTextStyle}>{project.name}</Text>
                        <Badge variant="filled" color={projectStatusColors[project.status]}>
                          {status?.label}
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
                <Grid.Col span={8}>
                  <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"} h={"46vh"}>
                    <Stack spacing={"xs"}>
                      <Flex direction={"row"} align={"center"}>
                        <Text {...titleTextStyle} size={"lg"}>
                          Project Details
                        </Text>
                        <Badge
                          ml={"lg"}
                          variant="filled"
                          color={projectStatusColors[selectedProject.status]}
                        >
                          {selectedProject.statusName}
                        </Badge>
                      </Flex>
                      <Divider color={colors.borderColor} mb={rem(8)} />
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
                          <Text {...bodyTextStyle}>{selectedProject.salesPersonValue?.name}</Text>
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
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                  <ScrollArea type="scroll" h={"48vh"}>
                    <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
                      <Flex direction={"row"} justify={"space-between"} align={"center"}>
                        <Text {...titleTextStyle} size={"lg"}>
                          Contacts
                        </Text>
                        <ActionIcon
                          variant="filled"
                          size={"sm"}
                          color={"dark"}
                          onClick={() => setAddContactModalOpened(true)}
                        >
                          <IconPlus size={16} stroke={1.3} color={colors.white} />
                        </ActionIcon>
                      </Flex>
                      <Divider color={colors.borderColor} mb={rem(8)} />
                      {contacts.map((contact) => {
                        return (
                          <>
                            <Flex direction={"column"} my={"md"}>
                              <Flex
                                direction={"row"}
                                justify={"space-between"}
                                align={"center"}
                                columnGap={"sm"}
                              >
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
                            <Divider />
                          </>
                        );
                      })}
                    </Card>
                  </ScrollArea>
                </Grid.Col>
              </Grid>

              <ScrollArea type="scroll" h={"46vh"}>
                <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
                  <Flex direction={"row"} justify={"space-between"} align={"center"}>
                    <Text {...titleTextStyle} size={"lg"}>
                      Meetings / Follow Up:
                    </Text>
                    <ActionIcon
                      variant="filled"
                      size={"sm"}
                      color={"dark"}
                      onClick={() => setAddFollowUpModalOpened(true)}
                    >
                      <IconPlus size={16} stroke={1.3} color={colors.white} />
                    </ActionIcon>
                  </Flex>
                  <Divider color={colors.borderColor} mb={rem(8)} />
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
                      <>
                        <Flex direction={"column"} my={"md"}>
                          <Text {...titleTextStyle} mb={"sm"}>
                            #{index + 1}
                          </Text>
                          <Flex direction={"row"} align={"center"} justify={"space-between"}>
                            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                              <Text {...titleTextStyle}>Date/Time: </Text>
                              <Text {...bodyTextStyle}>
                                {" "}
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
                          </Flex>

                          <Flex direction={"row"} align={"center"} justify={"space-between"}>
                            <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                              <Text {...titleTextStyle}>Agenda:</Text>
                              <Text {...bodyTextStyle}>{followUp.meetingAgenda}</Text>
                            </Flex>
                          </Flex>

                          <Flex direction={"row"} align={"center"} justify={"space-between"}>
                            <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                              <Text {...titleTextStyle}>Summary:</Text>
                              <Text {...bodyTextStyle}>{followUp.meetingSummary}</Text>
                            </Flex>
                          </Flex>

                          <Flex direction={"row"} align={"center"} justify={"space-between"}>
                            <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
                              <Text {...titleTextStyle}>Total Expense:</Text>
                              <Text {...bodyTextStyle}>{value}</Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Divider />
                      </>
                    );
                  })}
                </Card>
              </ScrollArea>
            </Stack>
          </Grid.Col>
        </Grid>
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
      </>
    );
  }
};

export default CompanyProjects;

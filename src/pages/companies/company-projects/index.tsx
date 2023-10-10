import React from "react";
import { useStyles } from "./styles";
import {
  Anchor,
  Badge,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  ScrollArea,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  selectCompaniesWithContact,
  selectCompanyContact,
  selectFollowUpsWithRecords,
  selectProjectWithRecords,
  useAppSelector,
} from "@store";
import { DAY_MM_DD_YYYY, DAY_MM_DD_YYYY_HH_MM_SS_A, projectStatusColors } from "@constants";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { colors } from "@theme";
import { IconChevronRight } from "@tabler/icons-react";

interface OwnProps {}
type ArrayToObj<T extends Array<Record<string, unknown>>> = T extends Array<infer U> ? U : never;

export const CompanyProjects: React.FC<OwnProps> = () => {
  useStyles();
  const { companyId } = useParams();
  const followUpList = useAppSelector(selectFollowUpsWithRecords);
  const projectsList = useAppSelector(selectProjectWithRecords);
  const companiesList = useAppSelector(selectCompaniesWithContact);
  const { data: contactsList } = useAppSelector(selectCompanyContact);
  const [isLoading, setIsLoading] = React.useState(true);
  const [company, setCompany] = React.useState<ICompany>();
  const [projects, setProjects] = React.useState<typeof projectsList>([]);
  const [contacts, setContacts] = React.useState<typeof contactsList>([]);
  const [followUps, setFollowUps] = React.useState<typeof followUpList>([]);
  const [selectedProject, setSelectedProject] = React.useState<ArrayToObj<typeof projectsList>>();

  React.useEffect(() => {
    if (!companyId) return;
    const company = companiesList.find((company) => company.id === parseInt(companyId));
    const project_s = projectsList.filter((project) => project.companyId === parseInt(companyId));
    const contact_s = contactsList.filter((contact) => contact.companyId === parseInt(companyId));
    setContacts(contact_s);
    setProjects(project_s);
    setCompany(company);
    if (project_s.length > 0) {
      setSelectedProject(project_s[0]);
      setFollowUps(followUpList.filter((followUp) => followUp.projectId === project_s[0].id));
    }
    setIsLoading(false);
  }, [companyId, companiesList, projectsList, contactsList, followUpList]);

  const handleSelectProject = (projectId: number) => {
    const project = projectsList.find((project) => project.id === projectId);
    setSelectedProject(project);
    const followUp_s = followUpList.filter((followUp) => followUp.projectId === projectId);
    setFollowUps(followUp_s);
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
    return <div>Invalid Data</div>;
  } else {
    return (
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
              return (
                <Card
                  key={project.id}
                  shadow="sm"
                  mb={"xs"}
                  px={"sm"}
                  py={"xs"}
                  radius={"md"}
                  onClick={() => handleSelectProject(project.id)}
                >
                  <Flex direction={"row"} justify={"space-between"} align={"center"}>
                    <Flex direction={"column"}>
                      <Text {...titleTextStyle}>{project.name}</Text>
                      <Badge variant="filled" color={projectStatusColors[project.statusId]}>
                        {project.statusName}
                      </Badge>
                    </Flex>
                    {selectedProject.id === project.id && (
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
                <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"} h={"48vh"}>
                  <Stack spacing={"xs"}>
                    <Flex direction={"row"} align={"center"}>
                      <Text {...titleTextStyle} size={"lg"}>
                        Project Details
                      </Text>
                      <Badge
                        ml={"lg"}
                        variant="filled"
                        color={projectStatusColors[selectedProject.statusId]}
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
                        <Text {...bodyTextStyle}>{selectedProject.projectType}</Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                        <Text {...titleTextStyle}>Salesman: </Text>
                        <Text {...bodyTextStyle}>
                          {selectedProject.salesPerson?.firstName}{" "}
                          {selectedProject.salesPerson?.lastName}
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
                        <Text {...titleTextStyle}>Contract: </Text>
                        <Text {...bodyTextStyle}>
                          {DateTime.fromISO(selectedProject.contractDate).toFormat(DAY_MM_DD_YYYY)}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                      <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                        <Text {...titleTextStyle}>Quotation: </Text>
                        <Text {...bodyTextStyle}>{selectedProject.quotation}</Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                        <Text {...titleTextStyle}>Delivery: </Text>
                        <Text {...bodyTextStyle}>
                          {" "}
                          {DateTime.fromISO(selectedProject.deliveryDate).toFormat(DAY_MM_DD_YYYY)}
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
                    <Text {...titleTextStyle} size={"lg"}>
                      Contacts
                    </Text>
                    <Divider color={colors.borderColor} mb={rem(8)} />
                    {contacts.map((contact) => {
                      return (
                        <>
                          <Flex direction={"column"} my={"md"}>
                            <Text {...bodyTextStyle}>{contact?.name}</Text>
                            <Text {...bodyTextStyle}>{contact?.designation}</Text>
                            <Anchor
                              {...bodyTextStyle}
                              href={contact?.email}
                              target={"_blank"}
                              c={"blue"}
                            >
                              {contact?.email}
                            </Anchor>
                            <Text {...bodyTextStyle}>
                              {contact?.phone}, {contact?.mobile}
                            </Text>
                          </Flex>
                          <Divider />
                        </>
                      );
                    })}
                  </Card>
                </ScrollArea>
              </Grid.Col>
            </Grid>

            <ScrollArea type="scroll" h={"48vh"}>
              <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
                <Text {...titleTextStyle} size={"lg"}>
                  Meetings / Follow Up:
                </Text>
                <Divider color={colors.borderColor} mb={rem(8)} />
                {followUps.map((followUp) => {
                  const value = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: followUp.expenses.amount.currency,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(followUp.expenses.amount.amount);

                  return (
                    <Flex direction={"column"} my={"md"}>
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
                  );
                })}
              </Card>
            </ScrollArea>
          </Stack>
        </Grid.Col>
      </Grid>
    );
  }
};

export default CompanyProjects;

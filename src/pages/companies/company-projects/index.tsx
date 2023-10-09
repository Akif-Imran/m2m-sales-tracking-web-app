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
              <Text size={"xl"}>Leads/Projects</Text>
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
                  <Text>{project.name}</Text>
                  <Badge variant="filled" color={projectStatusColors[project.statusId]}>
                    {project.statusName}
                  </Badge>
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
                      <Text size={"xl"} underline={true}>
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
                    <Text>
                      <u>Name</u>: {selectedProject.name}
                    </Text>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                      <Text>
                        <u>Type</u>: {selectedProject.projectType}
                      </Text>
                      <Text>
                        <u>Salesman</u>: {selectedProject.salesPerson?.firstName},{" "}
                        {selectedProject.salesPerson?.lastName}
                      </Text>
                    </Flex>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                      <Text>
                        <u>Value</u>:{" "}
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: selectedProject.value.currency,
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        }).format(selectedProject.value.amount)}
                      </Text>
                      <Text>
                        <u>Contract</u>:{" "}
                        {DateTime.fromISO(selectedProject.contractDate).toFormat(DAY_MM_DD_YYYY)}
                      </Text>
                    </Flex>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                      <Text>
                        <u>Quotation</u>: {selectedProject.quotation}
                      </Text>
                      <Text>
                        <u>Delivery</u>:{" "}
                        {DateTime.fromISO(selectedProject.deliveryDate).toFormat(DAY_MM_DD_YYYY)}
                      </Text>
                    </Flex>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                      <Text>
                        <u>Description</u>: {selectedProject.description}
                      </Text>
                    </Flex>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <ScrollArea type="scroll" h={"48vh"}>
                  <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
                    <Text size={"xl"} underline={true}>
                      Contacts
                    </Text>
                    {contacts.map((contact) => {
                      return (
                        <>
                          <Flex direction={"column"} my={"md"}>
                            <Text underline>{contact?.name}</Text>
                            <Text>{contact?.designation}</Text>
                            <Anchor underline href={contact?.email} target={"_blank"} c={"blue"}>
                              {contact?.email}
                            </Anchor>
                            <Text>
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
                <Text size={"xl"} underline={true}>
                  Meetings / Follow Up:
                </Text>
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
                        <Text>
                          <u>Date/Time</u>:{" "}
                          {DateTime.fromISO(followUp.meetingDate).toFormat(
                            DAY_MM_DD_YYYY_HH_MM_SS_A
                          )}
                        </Text>
                        <Text>
                          <u>Location</u>: {followUp.meetingPlace}
                        </Text>
                        <Text>
                          <u>Meeting With</u>: {followUp.contactPerson?.name}
                        </Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Text>
                          <u>Agenda</u>: {followUp.meetingAgenda}
                        </Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Text>
                          <u>Summary</u>: {followUp.meetingSummary}
                        </Text>
                      </Flex>
                      <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Text>
                          <u>Total Expense</u>: {value}
                        </Text>
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

import React from "react";
import { Accordion, Badge, Table, Text } from "@mantine/core";
import { projectStatusColors, userStatusColors } from "@constants";
import { selectProjectStatusList, selectUserTypes, useAppSelector } from "@store";

interface OwnProps {}

const _Help: React.FC<OwnProps> = () => {
  const { data: projectStatuses } = useAppSelector(selectProjectStatusList);
  const { data: userTypes } = useAppSelector(selectUserTypes);

  const projectStatusDescription: Record<number, string> = {
    1: "When the prospect is added it should be lead added with lead status.",
    2: "When further progress is made on the lead and follow Ups (Meetings) are conducted. The status should be updated to this.",
    3: "After submitting a quotation the status should be updated to this. With relevant details",
    4: "When work order for a prospect is received it become a project and will now show up under project management module. Use 'Move to projects' from the context menu to update the status to this.",
    5: "After receiving payment update the status to this.",
    6: "Marks the project as completed after its delivered.",
  };

  const userTypeDescription: Record<number, string> = {
    1: "The highest access level is Admin. Nothing is hidden from admin. Certain features are only accessible by admin. For example Edit, Delete Records and  'Suppliers', 'Warehouse', 'Expense Types', and 'Purchase Category' in settings.",
    2: "This level represents the sales staff. They typically work on generating leads.",
    3: "The technical staff assigned to a project by admin.",
    4: "This represents Accounts or HR. Restricted from certain features such as adding a purchase request. Because a user of this level holds the right to approve 'Purchase Requests'.",
  };

  return (
    <Accordion variant="contained" radius={"md"}>
      <Accordion.Item value="project-status">
        <Accordion.Control>
          <Text fw="bolder" size={"lg"} c={"#495057"}>
            Project Status Info
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {projectStatuses.map((status) => {
                return (
                  <tr>
                    <td>
                      <Badge variant="filled" color={projectStatusColors[status.id]}>
                        {status.name}
                      </Badge>
                    </td>
                    <td>
                      <Text size="sm" color="dimmed">
                        {projectStatusDescription[status.id]}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="user-level">
        <Accordion.Control>
          <Text fw="bolder" size={"lg"} c={"#495057"}>
            User Level Info
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Level</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {userTypes.map((status) => {
                return (
                  <tr>
                    <td>
                      <Badge variant="filled" color={userStatusColors[status.id]}>
                        {status.name}
                      </Badge>
                    </td>
                    <td>
                      <Text size="sm" color="dimmed">
                        {userTypeDescription[status.id]}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export { _Help };

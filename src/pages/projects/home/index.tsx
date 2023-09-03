import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@store";
import { useGStyles } from "../../../styles";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { openDeleteModalHelper } from "@helpers";
import { notify } from "@utility";
import { colors } from "@theme";
import { deleteProject } from "@slices";

interface OwnProps {}

const Projects: React.FC<OwnProps> = () => {
  useStyles();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data } = useAppSelector((state) => state.companies);
  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<ICompany[]>([]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter((company) =>
      company.name.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(data);
  }, [data]);

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Service`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this project? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Service",
      onConfirm: () => {
        dispatch(deleteProject(id));
        notify("Delete Company", "Company deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Company", "Operation canceled!", "error"),
    });
  };

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Projects
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((project, index) => (
          <tr key={project.id}>
            <td>{index + 1}</td>
            <td>
              <Avatar src={project.logo} size={50} />
            </td>
            <td>{project.id}</td>
            <td>{project.name}</td>
            <td>{project.contact.name}</td>
            <td>{project.contact.designation}</td>
            <td>{project.contact.email}</td>
            <td>{project.contact.phone}</td>
            <td>{project.email}</td>
            <td>{project.phone}</td>
            <td>{project.address}</td>
            <td>{project.city}</td>
            <td>{project.country}</td>
            <td>
              <Group>
                {/* <ActionIcon color="gray" size={"sm"}>
                  <IconPencil />
                </ActionIcon> */}
                <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(project.id)}>
                  <IconTrash />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        ))}
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
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddCompanyModalOpened(true)}
        >
          Project
        </Button>
      </Flex>
      <ScrollArea type="scroll" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Company</th>
                <th colSpan={4}>Contact Person</th>
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
    </Stack>
  );
};

export { Projects };

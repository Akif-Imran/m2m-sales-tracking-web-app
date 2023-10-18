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
import { IconId, IconPlus, IconSearch, IconTable, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { openDeleteModalHelper } from "@helpers";
import { selectUserWithRecords, useAppDispatch, useAppSelector } from "@store";
import { useGStyles } from "../../../styles";
import { deleteUser } from "@slices";
import { notify } from "@utility";
import { _AddUserModal, _UserCard } from "../components";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY } from "@constants";
import { useToggle } from "@mantine/hooks";
import { BASE_URL } from "@api";

interface OwnProps {}

const Users: React.FC<OwnProps> = () => {
  useStyles();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const [viewMode, toggle] = useToggle(["cards", "list"]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addUserModalOpened, setAddUserModalOpened] = React.useState(false);
  const [editUserModalOpened, setEditUserModalOpened] = React.useState(false);
  const users = useAppSelector(selectUserWithRecords);
  const [searchedData, setSearchedData] = React.useState<typeof users>([]);
  const [selectedUser, setSelectedUser] = React.useState<IUser>({} as IUser);

  const handleEditUser = React.useCallback((user: IUser) => {
    setSelectedUser(user);
    setEditUserModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(users);
  }, [users]);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete User`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this user? This action is destructive and you will have to
          contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        dispatch(deleteUser(id));
        notify("Delete User", "User deleted successfully!", "success");
      },
      onCancel: () => notify("Delete User", "Operation canceled!", "error"),
    });
  };

  let icon: JSX.Element;
  if (viewMode === "cards") {
    icon = <IconId size={22} color={colors.white} />;
  } else {
    icon = <IconTable size={22} color={colors.white} />;
  }

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Users
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((user, index) => {
          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={user._id}>
                <_UserCard item={user} handleDelete={handleDelete} setForEdit={handleEditUser} />
              </Grid.Col>
            );
          } else {
            return (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={user?.picture ? `${BASE_URL}\\${user.picture}` : "/user.png"}
                    size={50}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.mobile}</td>
                <td>{user.department}</td>
                <td>{user.designation}</td>
                <td>{DateTime.fromISO(user.joiningDate).toFormat(DAY_MM_DD_YYYY)}</td>
                <td>{user.userTypeName}</td>
                <td>
                  <Group>
                    <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(user._id)}>
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            );
          }
        })}
      </>
    );

  let content: JSX.Element;
  if (viewMode === "cards") {
    content = <Grid columns={12}>{rows}</Grid>;
  } else {
    content = (
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={3}>User</th>
                <th colSpan={7}>User Details</th>
                <th colSpan={1}>Action</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Name</th>

                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>User Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
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
          onClick={() => setAddUserModalOpened(true)}
        >
          User
        </Button>
      </Flex>

      {/* <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>User</th>
                <th colSpan={1}>Company</th>
                <th colSpan={8}>User Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Id</th>
                <th>Name</th>

                <th>Name</th>

                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>User Type</th>
                <th>Address</th>
                <th>City</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea> */}
      {content}
      <_AddUserModal
        mode="add"
        title="Add User"
        record={undefined}
        opened={addUserModalOpened}
        onClose={() => setAddUserModalOpened(false)}
      />
      <_AddUserModal
        mode="edit"
        title="Update User"
        record={selectedUser}
        opened={editUserModalOpened}
        onClose={() => setEditUserModalOpened(false)}
      />
    </Stack>
  );
};

export { Users };

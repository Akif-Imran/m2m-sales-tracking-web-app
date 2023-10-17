import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Divider,
  FileButton,
  Flex,
  Grid,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput,
  rem,
} from "@mantine/core";
import { useFormik } from "formik";
import { IconCalendar, IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addUser } from "@slices";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { colors } from "@theme";
import { createUser } from "@thunks";
import { useAuthContext } from "@contexts";
import { uploadFile } from "@services";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IUserForm extends Omit<IUser, "_id" | "__v" | "isActive" | "createdAt" | "company"> {
  picture: string;
  hasPicture: boolean;
}

const _AddUserModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const { userTypes } = useAppSelector(selectRecordsForDropdown);
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = React.useState(false);
  const [file, setFile] = React.useState<File>({} as File);

  const form = useFormik<IUserForm>({
    initialValues: {
      picture: "", //
      hasPicture: false,
      department: "",
      designation: "",
      joiningDate: "",
      name: "", //
      email: "", //
      password: "", //
      mobile: "", //
      userType: 2,
    },
    onSubmit: async (values, helpers) => {
      console.log(values);
      setIsCreating((_prev) => true);
      if (values.hasPicture) {
        const res = await uploadFile(token, file);
        console.log("User Image Upload: ", res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          values.picture = res.data;
        } else {
          setIsCreating((_prev) => false);
          notify("Add User", res?.message, "error");
          return;
        }
      }
      dispatch(
        createUser({
          token,
          user: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Add User", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addUser(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add User: ", err?.message);
          notify("Add User", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Vehicle image not uploaded", "error");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, picture: dataUri, hasPicture: true }));
      }
    };
    reader.readAsDataURL(file);
    // const fileUri = URL.createObjectURL(file);
    // setFileUri(fileUri);
  };

  const handleCancel = () => {
    setIsCreating((_prev) => false);
    form.resetForm();
    onClose();
  };
  const handleOnChangeUserType = (value: string | null) => {
    if (!value) return;
    const typeName = userTypes.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      userType: parseInt(value),
    }));
  };

  const handleOnChangeJoiningDate = (value: DateValue) => {
    if (value) {
      form.setValues((prev) => ({
        ...prev,
        joiningDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  return (
    <Modal
      size="xl"
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack>
        <Flex direction={"column"} align={"center"} justify={"flex-end"}>
          {form.values.picture ? (
            <Avatar src={form.values.picture} radius={rem(250)} size={rem(170)} />
          ) : (
            <Avatar src={"/user.png"} radius={rem(250)} size={rem(170)} />
          )}
          <div className={classes.fileUploadButton}>
            <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  radius={"xl"}
                  variant="filled"
                  color={theme.primaryColor}
                  {...props}
                  rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                >
                  Avatar
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
        <Grid columns={25}>
          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="User" labelPosition="center" />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Name"
                  name="name"
                  id="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Email"
                name="email"
                id="email"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <PasswordInput
                required
                withAsterisk={false}
                label="Password"
                name="password"
                id="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.password && form.errors.password ? `${form.errors.password}` : null
                }
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Designation"
                  name="designation"
                  id="designation"
                  value={form.values.designation}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Department"
                  name="department"
                  id="department"
                  value={form.values.department}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={1} />

          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="More Details" labelPosition="center" />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  placeholder="+XX XXX XXXXXXX"
                  label="Mobile No."
                  name="mobile"
                  id="mobile"
                  value={form.values.mobile}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <DatePickerInput
                  required
                  dropdownType="modal"
                  withAsterisk={false}
                  placeholder="Joining Date"
                  name="joiningDate"
                  id="joiningDate"
                  label="Joining Date"
                  onBlur={form.handleBlur}
                  onChange={handleOnChangeJoiningDate}
                  icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                  error={
                    form.touched.joiningDate && form.errors.joiningDate
                      ? `${form.errors.joiningDate}`
                      : null
                  }
                />
              </Group>
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Such User Type"
                label="User Type"
                value={form.values.userType.toString()}
                onChange={handleOnChangeUserType}
                data={userTypes}
              />

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button
                  size="xs"
                  variant="filled"
                  loading={isCreating}
                  onClick={() => form.handleSubmit()}
                >
                  Save
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  );
};

export { _AddUserModal };

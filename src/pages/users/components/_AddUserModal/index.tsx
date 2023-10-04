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

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IUserForm extends Omit<IUser, "id"> {}

const _AddUserModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const { companies, departments, userTypes } = useAppSelector(selectRecordsForDropdown);
  const dispatch = useAppDispatch();

  const form = useFormik<IUserForm>({
    initialValues: {
      avatar: "", //
      designation: "",
      joiningDate: "",
      firstName: "", //
      lastName: "", //
      email: "", //
      password: "", //
      phone: "", //
      address: "", //
      city: "", //
      country: "", //
      companyId: 0, //
      departmentId: 0,
      departmentName: "",
      userTypeId: 0,
      userTypeName: "",
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addUser(values));
      helpers.resetForm();
      onClose();
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Vehicle image not uploaded", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, avatar: dataUri }));
      }
    };
    reader.readAsDataURL(file);
    // const fileUri = URL.createObjectURL(file);
    // setFileUri(fileUri);
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };
  const handleOnChangeUserType = (value: string | null) => {
    if (!value) return;
    const typeName = userTypes.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      userTypeId: parseInt(value),
      userTypeName: typeName,
    }));
  };

  const handleOnChangeDepartment = (value: string | null) => {
    if (!value) return;
    const typeName = departments.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      departmentId: parseInt(value),
      departmentName: typeName,
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
          {form.values.avatar ? (
            <Avatar src={form.values.avatar} radius={rem(250)} size={rem(170)} />
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
                  label="First Name"
                  name="firstName"
                  id="firstName"
                  value={form.values.firstName}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Last Name"
                  name="lastName"
                  id="lastName"
                  value={form.values.lastName}
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
                  label="City"
                  name="city"
                  id="city"
                  value={form.values.city}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Country"
                  name="country"
                  id="country"
                  value={form.values.country}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Address"
                name="address"
                id="address"
                value={form.values.address}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={1} />

          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="More Details" labelPosition="center" />
              <TextInput
                required
                withAsterisk={false}
                placeholder="+XX XXX XXXXXXX"
                label="Mobile No."
                name="phone"
                id="phone"
                value={form.values.phone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <Group grow align="flex-start">
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Companies"
                  label="Company"
                  value={form.values.companyId.toString()}
                  onChange={(value) => {
                    if (!value) return;
                    form.setValues((prev) => ({ ...prev, companyId: parseInt(value) }));
                  }}
                  data={companies}
                />
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Departments"
                  label="Department"
                  value={form.values.departmentId.toString()}
                  onChange={handleOnChangeDepartment}
                  data={departments}
                />
              </Group>
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Such User Type"
                label="User Type"
                value={form.values.userTypeId.toString()}
                onChange={handleOnChangeUserType}
                data={userTypes}
              />
              <Group grow align="flex-start">
                <DatePickerInput
                  required
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
              </Group>

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button variant="filled" onClick={() => form.handleSubmit()} size="xs">
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

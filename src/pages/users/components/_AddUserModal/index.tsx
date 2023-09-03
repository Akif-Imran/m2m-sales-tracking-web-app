import { modalOverlayPropsHelper } from "@helpers";
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
import { IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { dropDownListSelectors, useAppDispatch, useAppSelector } from "@store";
import { addUser } from "@slices";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IUserForm extends Omit<IUser, "id"> {}

const _AddUserModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const { companies, departments, userTypes } = useAppSelector(dropDownListSelectors);
  const dispatch = useAppDispatch();

  const company = useFormik<IUserForm>({
    initialValues: {
      avatar: "", //
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
        company.setValues((prev) => ({ ...prev, avatar: dataUri }));
      }
    };
    reader.readAsDataURL(file);
    // const fileUri = URL.createObjectURL(file);
    // setFileUri(fileUri);
  };

  const handleCancel = () => {
    company.resetForm();
    onClose();
  };
  const handleOnChangeUserType = (value: string | null) => {
    if (!value) return;
    const typeName = userTypes.find((type) => type.value === value)?.label;
    if (!typeName) return;
    company.setValues((prev) => ({
      ...prev,
      userTypeId: parseInt(value),
      userTypeName: typeName,
    }));
  };

  const handleOnChangeDepartment = (value: string | null) => {
    if (!value) return;
    const typeName = departments.find((type) => type.value === value)?.label;
    if (!typeName) return;
    company.setValues((prev) => ({
      ...prev,
      departmentId: parseInt(value),
      departmentName: typeName,
    }));
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
          {company.values.avatar ? (
            <Avatar src={company.values.avatar} radius={rem(250)} size={rem(170)} />
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
                  value={company.values.firstName}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Last Name"
                  name="lastName"
                  id="lastName"
                  value={company.values.lastName}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Email"
                name="email"
                id="email"
                value={company.values.email}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
              />
              <PasswordInput
                required
                withAsterisk={false}
                label="Password"
                name="password"
                id="password"
                value={company.values.password}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
                error={
                  company.touched.password && company.errors.password
                    ? `${company.errors.password}`
                    : null
                }
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="City"
                  name="city"
                  id="city"
                  value={company.values.city}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Country"
                  name="country"
                  id="country"
                  value={company.values.country}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Address"
                name="address"
                id="address"
                value={company.values.address}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
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
                value={company.values.phone}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
              />
              <Group grow align="flex-start">
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Companies"
                  label="Company"
                  value={company.values.companyId.toString()}
                  onChange={(value) => {
                    if (!value) return;
                    company.setValues((prev) => ({ ...prev, companyId: parseInt(value) }));
                  }}
                  data={companies}
                />
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Departments"
                  label="Department"
                  value={company.values.departmentId.toString()}
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
                value={company.values.userTypeId.toString()}
                onChange={handleOnChangeUserType}
                data={userTypes}
              />

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button variant="filled" onClick={() => company.handleSubmit()} size="xs">
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

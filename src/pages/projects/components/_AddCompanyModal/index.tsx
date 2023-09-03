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
  Stack,
  TextInput,
  rem,
} from "@mantine/core";
import { useFormik } from "formik";
import { IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { useAppDispatch } from "@store";
import { addCompany } from "@slices";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface ICompanyForm extends Omit<ICompany, "id"> {}

const _AddCompanyModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const dispatch = useAppDispatch();

  const company = useFormik<ICompanyForm>({
    initialValues: {
      logo: "",
      name: "",
      contact: {
        name: "",
        designation: "",
        email: "",
        phone: "",
      },
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addCompany(values));
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
        company.setValues((prev) => ({ ...prev, logo: dataUri }));
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

  return (
    <Modal
      size="xl"
      // fullScreen
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack>
        <Flex direction={"column"} align={"center"} justify={"flex-end"}>
          {company.values.logo ? (
            <Avatar src={company.values.logo} radius={rem(250)} size={rem(170)} />
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
                  Logo
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
        <Grid columns={25}>
          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="Company" labelPosition="center" />
              <TextInput
                required
                withAsterisk={false}
                label="Name"
                name="name"
                id="name"
                value={company.values.name}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
              />
              <Group grow align="flex-start">
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
                <TextInput
                  required
                  withAsterisk={false}
                  label="Phone"
                  name="phone"
                  id="phone"
                  value={company.values.phone}
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
            </Stack>
          </Grid.Col>

          <Grid.Col span={1} />

          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="Contact" labelPosition="center" />
              <TextInput
                required
                withAsterisk={false}
                label="Name"
                name="contact.name"
                id="contact.name"
                value={company.values.contact.name}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Email"
                  name="contact.email"
                  id="contact.email"
                  value={company.values.contact.email}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Phone"
                  placeholder="+60 123 4562345"
                  name="contact.phone"
                  id="contact.phone"
                  value={company.values.contact.phone}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Designation"
                name="contact.designation"
                id="contact.designation"
                value={company.values.contact.designation}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
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

export { _AddCompanyModal };

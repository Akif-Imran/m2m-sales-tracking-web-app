import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Divider,
  FileButton,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  rem,
} from "@mantine/core";
import { useFormik } from "formik";
import { notify } from "@utility";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addContact } from "@slices";
import { IconUpload } from "@tabler/icons-react";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IContactForm extends Omit<ICompanyContact, "id"> {}

const _AddContactModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const dispatch = useAppDispatch();
  const { companies: companiesList } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IContactForm>({
    initialValues: {
      businessCard: "",
      name: "",
      designation: "",
      department: "",
      email: "",
      phone: "",
      mobile: "",
      primary: false,
      companyId: 0,
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addContact(values));
      notify("Add Contact", "Contact added successfully", "success");
      helpers.resetForm();
      onClose();
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleLogoChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Business card not uploaded", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, businessCard: dataUri }));
      }
    };
    reader.readAsDataURL(file);
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
      <Stack spacing={"xs"}>
        <Flex direction={"column"} align={"center"} justify={"flex-end"}>
          {form.values.businessCard ? (
            <Avatar src={form.values.businessCard} radius={rem(250)} size={rem(170)} />
          ) : (
            <Avatar src={"/user.png"} radius={rem(250)} size={rem(170)} />
          )}
          <div className={classes.fileUploadButton}>
            <FileButton onChange={handleLogoChange} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  radius={"xl"}
                  variant="filled"
                  color={theme.primaryColor}
                  {...props}
                  rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                >
                  BusinessCard
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
        <Divider label="Company" labelPosition="center" />
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
          data={companiesList}
        />
        <Divider label="Contact" labelPosition="center" />
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

        <Group grow align="flex-start">
          <TextInput
            required
            withAsterisk={false}
            label="Mobile"
            name="mobile"
            id="mobile"
            placeholder="+XX XXX XXXXXXX"
            value={form.values.mobile}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          <TextInput
            required
            withAsterisk={false}
            label="Phone"
            name="phone"
            id="phone"
            placeholder="+XX XXX XXXXXXX"
            value={form.values.phone}
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
    </Modal>
  );
};

export { _AddContactModal };

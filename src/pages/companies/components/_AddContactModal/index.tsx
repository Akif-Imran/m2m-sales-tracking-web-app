import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Divider, Group, Modal, Select, Stack, TextInput, rem } from "@mantine/core";
import { useFormik } from "formik";
import { notify } from "@utility";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addContact } from "@slices";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IContactForm extends Omit<ICompanyContact, "id"> {}

const _AddContactModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const { companies: companiesList } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IContactForm>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
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

import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Stack, TextInput, rem } from "@mantine/core";
import { useFormik } from "formik";
import { useAppDispatch } from "@store";
import { addSupplier } from "@slices";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface ISupplierForm extends Omit<ISupplier, "id"> {}

const _AddSupplierModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();

  const form = useFormik<ISupplierForm>({
    initialValues: {
      name: "",
      state: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      websiteURL: "",
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addSupplier(values));
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
      <Stack>
        <Grid>
          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
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
              <Group grow align="flex-start">
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
                <TextInput
                  required
                  withAsterisk={false}
                  label="Phone"
                  name="phone"
                  id="phone"
                  value={form.values.phone}
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
                  label="State"
                  name="state"
                  id="state"
                  value={form.values.state}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Group>

              <Group grow align="flex-start">
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
                <TextInput
                  required
                  withAsterisk={false}
                  label="Website URL"
                  name="websiteURL"
                  id="websiteURL"
                  value={form.values.websiteURL}
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

export { _AddSupplierModal };

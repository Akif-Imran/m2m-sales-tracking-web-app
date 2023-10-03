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
      state: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      primaryContactId: 0,
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addCompany(values));
      helpers.resetForm();
      onClose();
    },
  });

  const handleLogoChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Company logo not uploaded", "error");
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
  };

  const handleCancel = () => {
    company.resetForm();
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
              <Flex direction={"column"} align={"center"} justify={"flex-end"}>
                {company.values.logo ? (
                  <Avatar src={company.values.logo} radius={rem(250)} size={rem(170)} />
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
                        Logo
                      </Button>
                    )}
                  </FileButton>
                </div>
              </Flex>
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
                  label="State"
                  name="state"
                  id="state"
                  value={company.values.state}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
              </Group>

              <Group grow align="flex-start">
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
                <TextInput
                  required
                  withAsterisk={false}
                  label="Website URL"
                  name="website"
                  id="website"
                  value={company.values.website}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                />
              </Group>

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

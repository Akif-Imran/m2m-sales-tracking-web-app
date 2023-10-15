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
import { createCompany } from "@thunks";
import { useAuthContext } from "@contexts";
import * as yup from "yup";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface ICompanyForm extends Omit<ICompany, "_id" | "__v" | "company" | "isActive" | "logo"> {
  logo?: string;
}

const schema: yup.ObjectSchema<ICompanyForm> = yup.object().shape({
  name: yup.string().required("Company name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  logo: yup.string().optional(),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  website: yup.string().url().required("Website is required"),
  city: yup.string().required("City is required"),
  phone: yup.string().required("Phone number is required"),
});

const _AddCompanyModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = React.useState(false);

  const company = useFormik<ICompanyForm>({
    initialValues: {
      name: "",
      email: "",
      logo: "",
      address: "",
      state: "",
      country: "",
      website: "",
      city: "",
      phone: "",
    },
    validationSchema: schema,
    onSubmit(values, helpers) {
      console.log(values);
      setIsCreating(true);
      dispatch(
        createCompany({
          token,
          company: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Company", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addCompany(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Company: ", err?.message);
          notify("Company", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating(false);
        });
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
                error={company.errors.name && company.touched.name ? company.errors.name : ""}
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
                  error={company.errors.email && company.touched.email ? company.errors.email : ""}
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
                  error={company.errors.phone && company.touched.phone ? company.errors.phone : ""}
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
                error={
                  company.errors.address && company.touched.address ? company.errors.address : ""
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
                  error={company.errors.city && company.touched.city ? company.errors.city : ""}
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
                  error={company.errors.state && company.touched.state ? company.errors.state : ""}
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
                  error={
                    company.errors.country && company.touched.country ? company.errors.country : ""
                  }
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Website URL"
                  name="website"
                  id="website"
                  placeholder="https://www.example.com"
                  value={company.values.website}
                  onChange={company.handleChange}
                  onBlur={company.handleBlur}
                  error={
                    company.errors.website && company.touched.website ? company.errors.website : ""
                  }
                />
              </Group>

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button
                  size="xs"
                  variant="filled"
                  loading={isCreating}
                  onClick={() => company.handleSubmit()}
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

export { _AddCompanyModal };

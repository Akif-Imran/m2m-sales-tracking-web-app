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
  Select,
  Stack,
  TextInput,
  rem,
} from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { selectCompanies, useAppDispatch, useAppSelector } from "@store";
import { addCompany, modifyCompany } from "@slices";
import { createCompany, updateCompany } from "@thunks";
import { useAuthContext } from "@contexts";
import * as yup from "yup";
import { uploadFile } from "@services";
import { malaysianStatesList, validWebsiteURL } from "@constants";
import { BASE_URL } from "@api";

type OwnProps =
  | {
      mode: "add";
      opened: boolean;
      onClose: () => void;
      title: string;
      companyId?: undefined;
    }
  | {
      mode: "edit";
      opened: boolean;
      onClose: () => void;
      title: string;
      companyId: string;
    };
interface IForm
  extends Omit<
    ICompany,
    "_id" | "__v" | "company" | "isActive" | "logo" | "email" | "website" | "branch"
  > {
  logo?: string;
  hasLogo: boolean;
  isDefaultCountry: boolean;
  email?: string;
  website?: string;
  branch?: string;
  postalCode: string;
  registration: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Company name is required"),
  email: yup.string().email("Invalid email").optional(),
  logo: yup.string().optional(),
  hasLogo: yup.boolean().required(),
  isDefaultCountry: yup.boolean().required(),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  website: yup.string().matches(validWebsiteURL, "Invalid Website URl").optional(),
  city: yup.string().required("City is required"),
  phone: yup.string().required("Phone number is required"),
  branch: yup.string().optional(),
  postalCode: yup.string().required("Postal code is required"),
  registration: yup.string().required("Registration number is required"),
});

const _AddCompanyModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add", companyId } = props;
  const { theme, classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { data: companies } = useAppSelector(selectCompanies);
  const [isCreating, setIsCreating] = React.useState(false);
  const [file, setFile] = React.useState<File>({} as File);

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      email: "",
      logo: "",
      hasLogo: false,
      address: "",
      state: "",
      isDefaultCountry: true,
      country: "Malaysia",
      website: "",
      city: "",
      phone: "",
      branch: "",
      postalCode: "",
      registration: "",
    },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      console.log(values);
      setIsCreating(true);
      if (values.hasLogo) {
        const res = await uploadFile(token, file);
        if (res.statusCode === 200 || res.statusCode === 201) {
          values.logo = res.data;
        } else {
          setIsCreating((_prev) => false);
          notify("Company", res?.message, "error");
          return;
        }
      }
      if (mode === "add") {
        handleAdd(values, helpers);
      } else {
        handleUpdate(values, helpers);
      }
    },
  });
  const handleAdd = (values: IForm, helpers: FormikHelpers<IForm>) => {
    dispatch(
      createCompany({
        token,
        company: {
          ...values,
          email: values.email || "",
          website: values.website || "",
        },
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
  };

  const handleUpdate = (values: IForm, helpers: FormikHelpers<IForm>) => {
    dispatch(
      updateCompany({
        token,
        id: companyId || "",
        company: {
          ...values,
          email: values.email || "",
          website: values.website || "",
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Company", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyCompany(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Update Company: ", err?.message);
        notify("Company", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const handleLogoChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Company logo not uploaded", "error");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, logo: dataUri, hasLogo: true }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOnChangeState = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      state: value,
    }));
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (mode === "add") return;
    if (!companyId) return;
    const company = companies.find((company) => company._id === companyId);
    if (!company) {
      notify("Company", "Company not found", "error");
      onClose();
      return;
    }
    console.log("company to updated found", company);
    form.setValues({
      name: company.name,
      email: company.email,
      logo: `${BASE_URL}\\${company.logo}` || "",
      hasLogo: !!company.logo,
      address: company.address,
      state: company.state,
      isDefaultCountry: company.country.toLowerCase() === "malaysia",
      country: company.country,
      website: company.website,
      city: company.city,
      phone: company.phone,
      branch: company.branch,
      postalCode: company.postalCode || "",
      registration: company.registration || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, mode, companyId]);

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
                {form.values.logo ? (
                  <Avatar src={form.values.logo} radius={rem(250)} size={rem(170)} />
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
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.name && form.touched.name ? form.errors.name : ""}
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Registration No."
                  name="registration"
                  id="registration"
                  value={form.values.registration}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.registration && form.touched.registration
                      ? form.errors.registration
                      : ""
                  }
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Branch"
                  name="branch"
                  id="branch"
                  value={form.values.branch}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.errors.branch && form.touched.branch ? form.errors.branch : ""}
                />
              </Group>
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
                  error={form.errors.email && form.touched.email ? form.errors.email : ""}
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
                  error={form.errors.phone && form.touched.phone ? form.errors.phone : ""}
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
                error={form.errors.address && form.touched.address ? form.errors.address : ""}
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
                  error={form.errors.city && form.touched.city ? form.errors.city : ""}
                />
                {form.values.isDefaultCountry ? (
                  <Select
                    withinPortal
                    required
                    withAsterisk={false}
                    searchable
                    nothingFound="No State"
                    label="State"
                    value={form.values.state}
                    onChange={handleOnChangeState}
                    data={malaysianStatesList}
                    error={form.touched.state && form.errors.state ? `${form.errors.state}` : null}
                  />
                ) : (
                  <TextInput
                    required
                    withAsterisk={false}
                    label="State"
                    name="state"
                    id="state"
                    value={form.values.state}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.errors.state && form.touched.state ? form.errors.state : ""}
                  />
                )}
              </Group>

              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Country"
                  name="country"
                  id="country"
                  value={form.values.country}
                  onChange={(e) => {
                    form.setValues((prev) => ({
                      ...prev,
                      isDefaultCountry: e.currentTarget.value.toLowerCase() === "malaysia",
                    }));
                    form.handleChange(e);
                  }}
                  onBlur={form.handleBlur}
                  error={form.errors.country && form.touched.country ? form.errors.country : ""}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Postal Code"
                  name="postalCode"
                  id="postalCode"
                  value={form.values.postalCode}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.postalCode && form.touched.postalCode ? form.errors.postalCode : ""
                  }
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Website URL"
                name="website"
                id="website"
                placeholder="https://www.example.com"
                value={form.values.website}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.website && form.touched.website ? form.errors.website : ""}
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

export { _AddCompanyModal };

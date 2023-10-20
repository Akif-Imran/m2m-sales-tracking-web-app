import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
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
import { createContact } from "@thunks";
import { useAuthContext } from "@contexts";
import * as yup from "yup";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId?: string;
}
interface IContactForm
  extends Omit<
    ICompanyContact,
    "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive"
  > {}

const schema: yup.ObjectSchema<IContactForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  businessCard: yup.string().required("Business card is required").nullable(),
  designation: yup.string().required("Designation is required"),
  department: yup.string().required("Department is required"),
  mobile: yup.string().required("Mobile number is required"),
  customerId: yup.string().required("Company is required"),
});

const _AddContactModal: React.FC<OwnProps> = ({ opened, onClose, title, companyId }) => {
  const { theme, classes } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const { companies: companiesList } = useAppSelector(selectRecordsForDropdown);
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useFormik<IContactForm>({
    initialValues: {
      name: "",
      email: "",
      businessCard: "",
      designation: "",
      department: "",
      mobile: "",
      customerId: companyId || "",
    },
    validationSchema: schema,
    onSubmit(values, helpers) {
      console.log(values);
      setIsCreating((_prev) => true);
      dispatch(
        createContact({
          token,
          contact: {
            ...values,
            businessCard: values.businessCard || "",
          },
        })
      )
        .unwrap()
        .then((res) => {
          notify("Contact", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addContact(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log(err?.message);
          notify("Contact", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
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

  React.useEffect(() => {
    if (companyId) {
      form.setValues((prev) => ({ ...prev, customerId: companyId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

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
        <Select
          required
          withAsterisk={false}
          searchable
          nothingFound="No Companies"
          label="Company"
          value={form.values.customerId}
          data={companiesList}
          onChange={(value) => {
            if (!value) return;
            form.setValues((prev) => ({ ...prev, customerId: value }));
          }}
        />
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
            error={
              form.errors.designation && form.touched.designation ? form.errors.designation : ""
            }
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
            error={form.errors.department && form.touched.department ? form.errors.department : ""}
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
            error={form.errors.mobile && form.touched.mobile ? form.errors.mobile : ""}
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
            onClick={() => form.handleSubmit()}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { _AddContactModal };

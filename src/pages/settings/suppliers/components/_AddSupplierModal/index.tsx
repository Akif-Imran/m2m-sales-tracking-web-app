import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Stack, TextInput, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { useAppDispatch } from "@store";
import * as yup from "yup";
import { createSupplier, updateSupplier } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { modifySupplier } from "@slices";

type OwnProps =
  | {
      opened: boolean;
      onClose: () => void;
      title: string;
      mode: "add";
      record: undefined;
    }
  | {
      opened: boolean;
      onClose: () => void;
      title: string;
      mode: "edit";
      record: ISupplier;
    };
interface ISupplierForm
  extends Omit<ISupplier, "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive"> {}

const schema: yup.ObjectSchema<ISupplierForm> = yup.object().shape({
  name: yup.string().required("Supplier name is required"),
  email: yup.string().email("Invalid email address").required("Supplier email is required"),
  mobile: yup.string().required("Supplier mobile is required"),
  address: yup.string().required("Supplier address is required"),
  city: yup.string().required("Supplier city is required"),
  state: yup.string().required("Supplier state is required"),
  country: yup.string().required("Supplier country is required"),
  website: yup.string().url().required("Supplier website is required"),
});

const _AddSupplierModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add" } = props;
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useFormik<ISupplierForm>({
    initialValues: {
      name: mode === "edit" ? props.record?.name || "" : "",
      email: mode === "edit" ? props.record?.email || "" : "",
      mobile: mode === "edit" ? props.record?.mobile || "" : "",
      address: mode === "edit" ? props.record?.address || "" : "",
      city: mode === "edit" ? props.record?.city || "" : "",
      state: mode === "edit" ? props.record?.state || "" : "",
      country: mode === "edit" ? props.record?.country || "" : "",
      website: mode === "edit" ? props.record?.website || "" : "",
    },
    validationSchema: schema,
    onSubmit: (values, helpers) => {
      console.log(values);
      if (mode === "add") {
        handleAdd(values, helpers);
      } else {
        handleUpdate(values, helpers);
      }
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleAdd = (values: ISupplierForm, helpers: FormikHelpers<ISupplierForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      createSupplier({
        token,
        supplier: {
          ...values,
          businessCard: "remove",
          designation: "remove",
          department: "remove",
          customerId: "remove",
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Add Supplier", res?.message, res.success ? "success" : "error");
        if (res.success) {
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Add Supplier: ", err?.message);
        notify("Add Supplier", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleUpdate = (values: ISupplierForm, helpers: FormikHelpers<ISupplierForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      updateSupplier({
        token,
        id: props.record?._id || "",
        supplier: {
          ...values,
          businessCard: "remove",
          designation: "remove",
          department: "remove",
          customerId: "remove",
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Supplier", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifySupplier(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Update Supplier: ", err?.message);
        notify("Update Supplier", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  React.useEffect(() => {
    if (mode === "edit" && !props.record) return;
    form.setValues((prev) => ({
      ...prev,
      name: mode === "edit" ? props.record?.name || "" : "",
      email: mode === "edit" ? props.record?.email || "" : "",
      mobile: mode === "edit" ? props.record?.mobile || "" : "",
      address: mode === "edit" ? props.record?.address || "" : "",
      city: mode === "edit" ? props.record?.city || "" : "",
      state: mode === "edit" ? props.record?.state || "" : "",
      country: mode === "edit" ? props.record?.country || "" : "",
      website: mode === "edit" ? props.record?.website || "" : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.record, mode]);

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
                error={form.touched.name && form.errors.name ? form.errors.name : ""}
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
                  error={form.touched.email && form.errors.email ? form.errors.email : ""}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Phone"
                  name="mobile"
                  id="mobile"
                  value={form.values.mobile}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.mobile && form.errors.mobile ? form.errors.mobile : ""}
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
                error={form.touched.address && form.errors.address ? form.errors.address : ""}
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
                  error={form.touched.city && form.errors.city ? form.errors.city : ""}
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
                  error={form.touched.state && form.errors.state ? form.errors.state : ""}
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
                  error={form.touched.country && form.errors.country ? form.errors.country : ""}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Website URL"
                  placeholder="https://www.example.com"
                  name="website"
                  id="website"
                  value={form.values.website}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.website && form.errors.website ? form.errors.website : ""}
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
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  );
};

export { _AddSupplierModal };

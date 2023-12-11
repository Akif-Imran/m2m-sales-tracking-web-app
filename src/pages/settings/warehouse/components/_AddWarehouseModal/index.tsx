import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Stack, TextInput, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { useAppDispatch } from "@store";
import * as yup from "yup";
import { createWarehouse, updateWarehouse } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { addWarehouse, modifyWarehouse } from "@slices";

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
      record: IWarehouse;
    };
interface IForm
  extends Omit<
    IWarehouse,
    "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive" | "updatedAt"
  > {}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Warehouse name is required"),
  description: yup.string().required("Warehouse description is required"),
});

export const _AddWarehouseModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add" } = props;
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      name: mode === "edit" ? props.record?.name || "" : "",
      description: mode === "edit" ? props.record?.description || "" : "",
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

  const handleAdd = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      createWarehouse({
        token,
        warehouse: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Add Warehouse", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(addWarehouse(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Add Warehouse: ", err?.message);
        notify("Add Warehouse", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleUpdate = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      updateWarehouse({
        token,
        id: props.record?._id || "",
        warehouse: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Warehouse", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyWarehouse(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Update Warehouse: ", err?.message);
        notify("Update Warehouse", "An error occurred", "error");
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
      description: mode === "edit" ? props.record?.description || "" : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.record, mode]);

  return (
    <Modal
      size="md"
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
              <TextInput
                required
                withAsterisk={false}
                label="Description"
                name="description"
                id="description"
                value={form.values.description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.description && form.errors.description ? form.errors.description : ""
                }
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

export default _AddWarehouseModal;

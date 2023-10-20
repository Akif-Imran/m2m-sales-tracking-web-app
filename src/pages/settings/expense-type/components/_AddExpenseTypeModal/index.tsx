import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Stack, TextInput, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { useAppDispatch } from "@store";
import * as yup from "yup";
import { createExpenseType, updateExpenseType } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { addExpenseType, modifyExpenseType } from "@slices";

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
      record: IExpenseType;
    };
interface IExpenseTypeForm
  extends Omit<IExpenseType, "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive"> {}

const schema: yup.ObjectSchema<IExpenseTypeForm> = yup.object().shape({
  name: yup.string().required("Expense type name is required"),
});

const _AddExpenseTypeModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add" } = props;
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useFormik<IExpenseTypeForm>({
    initialValues: {
      name: mode === "edit" ? props.record?.name || "" : "",
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

  const handleAdd = (values: IExpenseTypeForm, helpers: FormikHelpers<IExpenseTypeForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      createExpenseType({
        token,
        expenseType: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Add Expense Type", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(addExpenseType(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Add Expense Type: ", err?.message);
        notify("Add Expense Type", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleUpdate = (values: IExpenseTypeForm, helpers: FormikHelpers<IExpenseTypeForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      updateExpenseType({
        token,
        id: props.record?._id || "",
        expenseType: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Expense Type", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyExpenseType(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Update Expense Type: ", err?.message);
        notify("Update Expense Type", "An error occurred", "error");
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

export { _AddExpenseTypeModal };

import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { notify } from "@utility";
import * as yup from "yup";
import { useAuthContext } from "@contexts";
import { transferStock } from "@thunks";
import { modifyStock } from "@slices";

type OwnProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  stock: IStock;
};

interface IForm {
  id: string;
  quantity: number;
  assignedTo: string;
  assignmentNote: string;
}

export const _AssignStockModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, stock } = props;
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const { engineers, salesPersons, hrs, stocks } = useAppSelector(selectRecordsForDropdown);
  const [isCreating, setIsCreating] = React.useState(false);

  const schema: yup.ObjectSchema<IForm> = yup.object().shape({
    id: yup.string().required("Stock is required"),
    quantity: yup.number().min(1).max(stock.quantity).required("Quantity is required"),
    assignedTo: yup.string().required("Transferee is required"),
    assignmentNote: yup.string().required("Transfer purpose or details is required"),
  });

  const form = useFormik<IForm>({
    initialValues: {
      id: stock._id || "",
      assignedTo: "",
      quantity: 1,
      assignmentNote: "",
      // quantity: mode === "edit" ? props.record?.quantity || 0 : 0,
    },
    validationSchema: schema,
    onSubmit: (values, helpers) => {
      console.log(values);
      handleTransfer(values, helpers);
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleTransfer = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      transferStock({
        token,
        body: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Transfer Stock", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyStock(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Transfer Stock: ", err?.message);
        notify("Transfer Stock", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleOnChangeAssignTo = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      assignedTo: value,
    }));
  };

  const handleOnChangeStock = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      id: value,
    }));
  };

  React.useEffect(() => {
    if (!props.stock) return;
    form.setValues((prev) => ({
      ...prev,
      id: props.stock._id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stock]);

  return (
    <Modal
      size="lg"
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
              <Select
                withinPortal
                required
                withAsterisk={false}
                searchable
                nothingFound="No status found"
                label="Stock"
                name="id"
                id="id"
                onBlur={form.handleBlur}
                value={form.values.id}
                onChange={handleOnChangeStock}
                data={stocks}
                error={form.errors.id && form.touched.id ? `${form.errors.id}` : null}
              />

              <Group align="flex-start" grow>
                <TextInput
                  required
                  withAsterisk={false}
                  label="Quantity"
                  name="quantity"
                  id="quantity"
                  value={form.values.quantity}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.quantity && form.errors.quantity ? form.errors.quantity : ""}
                  type="number"
                  inputMode="numeric"
                />

                <Select
                  withinPortal
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No such user"
                  label="Transfer To"
                  name="assignedTo"
                  id="assignedTo"
                  onBlur={form.handleBlur}
                  value={form.values.assignedTo}
                  onChange={handleOnChangeAssignTo}
                  data={[...engineers, ...salesPersons, ...hrs]}
                  error={
                    form.errors.assignedTo && form.touched.assignedTo
                      ? `${form.errors.assignedTo}`
                      : null
                  }
                />
              </Group>

              <Textarea
                required
                withAsterisk={false}
                label="Transfer Note"
                placeholder="Purpose of transfer details"
                name="assignmentNote"
                id="assignmentNote"
                value={form.values.assignmentNote}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.assignmentNote && form.errors.assignmentNote
                    ? form.errors.assignmentNote
                    : ""
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

export default _AssignStockModal;

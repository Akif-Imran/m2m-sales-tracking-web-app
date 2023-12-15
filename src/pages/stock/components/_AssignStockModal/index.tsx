import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { selectRecordsForDropdown, useAppSelector } from "@store";
import { notify } from "@utility";
import * as yup from "yup";

type OwnProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  stock: IStock;
};

interface IForm {
  stockId: string;
  userId: string;
  quantity: number;
}

export const _AssignStockModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, stock } = props;
  const { theme } = useStyles();
  /*   const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext(); */
  const { engineers, salesPersons, hrs, stocks } = useAppSelector(selectRecordsForDropdown);
  const [isCreating, setIsCreating] = React.useState(false);

  const schema: yup.ObjectSchema<IForm> = yup.object().shape({
    stockId: yup.string().required("Stock is required"),
    userId: yup.string().required("Assignee is required"),
    quantity: yup.number().min(1).max(stock.quantity).required("Quantity is required"),
  });

  const form = useFormik<IForm>({
    initialValues: {
      stockId: stock._id || "",
      userId: "",
      quantity: 1,
      // quantity: mode === "edit" ? props.record?.quantity || 0 : 0,
    },
    validationSchema: schema,
    onSubmit: (values, helpers) => {
      console.log(values);
      handleAdd(values, helpers);
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleAdd = (_values: IForm, _helpers: FormikHelpers<IForm>) => {
    setIsCreating((_prev) => true);
    /*  dispatch(
      createStock({
        token,
        stock: {
          ...values,
          modelNo: values.modelNo || "",
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Add Stock", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(addStock(res.data));
          helpers.resetForm();
          onClose();
        }
      }) */
    new Promise((_resolve, reject) => {
      reject("Missing stock API's");
    })
      .catch((err) => {
        console.log("Assign Stock: ", err?.message);
        notify("Assign Stock", err?.message, "error");
        // notify("Add Stock", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  /*   const handleUpdate = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      updateStock({
        token,
        id: props.record?._id || "",
        stock: {
          ...values,
          modelNo: values.modelNo || "",
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Stock", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyStock(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Update Stock: ", err?.message);
        notify("Update Stock", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  }; */

  /* const handleReceiptChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Item image not uploaded", "error");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, image: dataUri }));
      }
    };
    reader.readAsDataURL(file);
  }; */

  const handleOnChangeAssignTo = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      userId: value,
    }));
  };

  const handleOnChangeStock = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      stockId: value,
    }));
  };

  /*   const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      status: parseInt(value),
    }));
  }; */

  /*   const handleOnChangePriceCurrency = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      cost: { ...prev.cost, currency: value },
    }));
  }; */

  React.useEffect(() => {
    if (!props.stock) return;
    form.setValues((prev) => ({
      ...prev,
      stockId: props.stock._id,
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
                label="Assign To"
                value={form.values.userId}
                onChange={handleOnChangeAssignTo}
                data={[...engineers, ...salesPersons, ...hrs]}
                error={form.errors.userId && form.touched.userId ? `${form.errors.userId}` : null}
              />

              <Select
                withinPortal
                required
                withAsterisk={false}
                searchable
                nothingFound="No status found"
                label="Stock"
                value={form.values.stockId}
                onChange={handleOnChangeStock}
                data={stocks}
                error={
                  form.errors.stockId && form.touched.stockId ? `${form.errors.stockId}` : null
                }
              />
              {/* <TextInput
                  required
                  withAsterisk={false}
                  label="Cost"
                  name="cost.amount"
                  id="cost.amount"
                  type="number"
                  value={form.values.cost.amount}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  rightSectionWidth={rem(88)}
                  rightSection={
                    <Select
                      required
                      withAsterisk={false}
                      searchable
                      radius={"xl"}
                      variant="unstyled"
                      nothingFound="No such currency"
                      value={form.values.cost.currency}
                      onChange={handleOnChangePriceCurrency}
                      data={currencyList}
                    />
                  }
                  error={
                    form.errors.cost?.amount && form.touched.cost?.amount
                      ? `${form.errors.cost?.amount}`
                      : null
                  }
                /> */}

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

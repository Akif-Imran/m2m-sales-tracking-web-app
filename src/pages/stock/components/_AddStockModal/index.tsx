import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import * as yup from "yup";
import { createStock, updateStock } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { addStock, modifyStock } from "@slices";

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
      record: IStock;
    };

interface IForm
  extends Omit<
    IStock,
    "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive" | "modelNo"
  > {
  modelNo?: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  serialNo: yup.string().required("Serial No is required"),
  modelNo: yup.string().optional(),
  totalCost: yup.number().min(0).required("Cost is required"),
  supplierId: yup.string().required("Supplier is required"),
  warehouseId: yup.string().required("Warehouse is required"),
  assignedTo: yup.string().required("Assignment must be made"),
  quantity: yup.number().required("Quantity is required"),
});

const _AddStockModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add" } = props;
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const { warehouses, suppliers, engineers, salesPersons } =
    useAppSelector(selectRecordsForDropdown);
  const [isCreating, setIsCreating] = React.useState(false);
  // const [_file, setFile] = React.useState<File>({} as File);

  const form = useFormik<IForm>({
    initialValues: {
      name: mode === "edit" ? props.record?.name || "" : "",
      type: mode === "edit" ? props.record?.type || "" : "",
      serialNo: mode === "edit" ? props.record?.serialNo || "" : "",
      modelNo: mode === "edit" ? props.record?.modelNo || "" : "",
      totalCost: mode === "edit" ? props.record?.totalCost || 0 : 0,
      supplierId: mode === "edit" ? props.record?.supplierId || "" : "",
      warehouseId: mode === "edit" ? props.record?.warehouseId || "" : "",
      assignedTo: mode === "edit" ? props.record?.assignedTo || "" : "",
      quantity: mode === "edit" ? props.record?.quantity || 0 : 0,
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
      })
      .catch((err) => {
        console.log("Add Stock: ", err?.message);
        notify("Add Stock", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleUpdate = (values: IForm, helpers: FormikHelpers<IForm>) => {
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
  };

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
      assignedTo: value,
    }));
  };

  const handleOnChangeSupplier = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      supplierId: value,
    }));
  };

  const handlOnChangeWarehouse = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      warehouseId: value,
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
    if (mode === "edit" && !props.record) return;
    form.setValues((prev) => ({
      ...prev,
      name: mode === "edit" ? props.record?.name || "" : "",
      type: mode === "edit" ? props.record?.type || "" : "",
      serialNo: mode === "edit" ? props.record?.serialNo || "" : "",
      modelNo: mode === "edit" ? props.record?.modelNo || "" : "",
      totalCost: mode === "edit" ? props.record?.totalCost || 0 : 0,
      supplierId: mode === "edit" ? props.record?.supplierId || "" : "",
      warehouseId: mode === "edit" ? props.record?.warehouseId || "" : "",
      assignedTo: mode === "edit" ? props.record?.assignedTo || "" : "",
      quantity: mode === "edit" ? props.record?.quantity || 0 : 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.record, mode]);

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
              {/* <Flex direction={"column"} align={"center"} justify={"flex-end"}>
                {form.values.image ? (
                  <Avatar src={form.values.image} radius={"md"} size={rem(170)} />
                ) : (
                  <div
                    style={{
                      width: rem(170),
                      height: rem(170),
                      borderRadius: theme.radius.md,
                      backgroundColor: `${theme.colors[theme.primaryColor][1]}`,
                    }}
                  />
                )}
                <div className={gclasses.fileUploadButton}>
                  <FileButton onChange={handleReceiptChange} accept="image/png,image/jpeg">
                    {(props) => (
                      <Button
                        radius={"xl"}
                        variant="filled"
                        color={theme.primaryColor}
                        {...props}
                        disabled={!form.values.image}
                        rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                      >
                        Image
                      </Button>
                    )}
                  </FileButton>
                </div>
              </Flex> */}

              <Group align="flex-start" grow>
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
                  label="Type"
                  name="type"
                  id="type"
                  value={form.values.type}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.type && form.errors.type ? form.errors.type : ""}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Total Cost"
                name="totalCost"
                id="totalCost"
                value={form.values.totalCost}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.totalCost && form.errors.totalCost ? form.errors.totalCost : ""}
                type="number"
                inputMode="numeric"
              />
              <Group align="flex-start" grow>
                <TextInput
                  required
                  withAsterisk={false}
                  label="Serial No."
                  name="serialNo"
                  id="serialNo"
                  value={form.values.serialNo}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.serialNo && form.errors.serialNo ? form.errors.serialNo : ""}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Model No."
                  name="modelNo"
                  id="modelNo"
                  value={form.values.modelNo}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.modelNo && form.errors.modelNo ? form.errors.modelNo : ""}
                />
              </Group>

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
                required
                withAsterisk={false}
                searchable
                nothingFound="No such user"
                label="Assign To"
                value={form.values.assignedTo}
                onChange={handleOnChangeAssignTo}
                data={[...engineers, ...salesPersons]}
                error={
                  form.errors.assignedTo && form.touched.assignedTo
                    ? `${form.errors.assignedTo}`
                    : null
                }
              />
              <Group align="flex-start" grow>
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No status found"
                  label="Warehouse"
                  value={form.values.warehouseId}
                  onChange={handlOnChangeWarehouse}
                  data={warehouses}
                  error={
                    form.errors.warehouseId && form.touched.warehouseId
                      ? `${form.errors.warehouseId}`
                      : null
                  }
                />
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No status found"
                  label="Supplier"
                  value={form.values.supplierId}
                  onChange={handleOnChangeSupplier}
                  data={suppliers}
                  error={
                    form.errors.supplierId && form.touched.supplierId
                      ? `${form.errors.supplierId}`
                      : null
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

export { _AddStockModal };

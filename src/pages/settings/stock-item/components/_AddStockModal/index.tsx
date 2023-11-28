import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
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
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import * as yup from "yup";
import { createStockItem, updateStockItem } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { addStockItem, modifyStockItem } from "@slices";
import { currencyList } from "@constants";
import { IconUpload } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";

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
      record: IStockItem;
    };

interface IForm
  extends Omit<
    IStockItem,
    "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive" | "assignedTo"
  > {
  assignedTo?: string;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  no: yup.number().required("No is required"),
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  cost: yup.object().shape({
    amount: yup.number().required("Value is required"),
    currency: yup.string().required("Currency is required"),
  }),
  assignedTo: yup.string().optional(),
  status: yup.number().required("Status is required"),
  image: yup.string().required("Image is required"),
});

const _AddStockModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title, mode = "add" } = props;
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const { stockItemStatus, engineers, salesPersons } = useAppSelector(selectRecordsForDropdown);
  const [isCreating, setIsCreating] = React.useState(false);
  const [_file, setFile] = React.useState<File>({} as File);

  const form = useFormik<IForm>({
    initialValues: {
      no: mode === "edit" ? props.record?.no || 1 : 1,
      name: mode === "edit" ? props.record?.name || "" : "",
      type: mode === "edit" ? props.record?.type || "" : "",
      assignedTo: mode === "edit" ? props.record?.assignedTo || "" : "",
      image: mode === "edit" ? props.record?.image || "" : "",
      status: mode === "edit" ? props.record?.status || 1 : 1,
      cost: {
        amount: mode === "edit" ? props.record?.cost?.amount || 0 : 0,
        currency: mode === "edit" ? props.record?.cost?.currency || "MYR" : "MYR",
      },
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
      createStockItem({
        token,
        stockItem: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Add Stock", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(addStockItem(res.data));
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
      updateStockItem({
        token,
        id: props.record?._id || "",
        stockItem: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Update Stock", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyStockItem(res.data));
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

  const handleReceiptChange = (file: File) => {
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
  };

  const handleOnChangeAssignTo = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      assignedTo: value,
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      status: parseInt(value),
    }));
  };

  const handleOnChangePriceCurrency = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      cost: { ...prev.cost, currency: value },
    }));
  };

  React.useEffect(() => {
    if (mode === "edit" && !props.record) return;
    form.setValues((prev) => ({
      ...prev,
      no: mode === "edit" ? props.record?.no || 1 : 1,
      name: mode === "edit" ? props.record?.name || "" : "",
      type: mode === "edit" ? props.record?.type || "" : "",
      assignedTo: mode === "edit" ? props.record?.assignedTo || "" : "",
      image: mode === "edit" ? props.record?.image || "" : "",
      status: mode === "edit" ? props.record?.status || 1 : 1,
      cost: {
        amount: mode === "edit" ? props.record?.cost?.amount || 0 : 0,
        currency: mode === "edit" ? props.record?.cost?.currency || "MYR" : "MYR",
      },
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
              <Flex direction={"column"} align={"center"} justify={"flex-end"}>
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
              </Flex>

              <TextInput
                maw={"50%"}
                required
                withAsterisk={false}
                label="No. / ID"
                name="no"
                id="no"
                value={form.values.no}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.no && form.errors.no ? form.errors.no : ""}
                type="number"
                inputMode="numeric"
              />
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
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No such assignee"
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
                  label="Status"
                  value={form.values.status.toString()}
                  onChange={handleOnChangeStatus}
                  data={stockItemStatus}
                  error={form.errors.status && form.touched.status ? `${form.errors.status}` : null}
                />
                <TextInput
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

export { _AddStockModal };

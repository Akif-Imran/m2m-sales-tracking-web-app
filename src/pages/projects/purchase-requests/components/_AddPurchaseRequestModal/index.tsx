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
  Textarea,
  rem,
} from "@mantine/core";
import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { selectLeads, selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addPurchaseRequest } from "@slices";
import { IconCalendar, IconUpload } from "@tabler/icons-react";
import { currencyList } from "@constants";
import { colors } from "@theme";
import { createPurchaseRequest } from "@thunks";
import { notify } from "@utility";
import * as yup from "yup";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId?: string;
  projectId?: string;
}
interface IRequestForm
  extends Omit<
    IPurchaseRequest,
    "_id" | "__v" | "createdBy" | "createdAt" | "company" | "isActive"
  > {
  quotation: string;
}

const schema = yup.object().shape({
  customerId: yup.string().required("Company is required"),
  projectId: yup.string().required("Project is required"),
  supplierId: yup.string().required("Supplier is required"),
  categoryId: yup.string().required("Category is required"),
  itemName: yup.string().required("Item name is required"),
  itemType: yup.string().required("Item type is required"),
  warranty: yup.string().required("Warranty is required"),
  price: yup.object().shape({
    amount: yup.number().required("Price is required"),
    currency: yup.string().required("Currency is required"),
  }),
  quantity: yup.number().required("Quantity is required"),
  remarks: yup.string().required("Remarks is required"),
  status: yup.number().required("Status is required"),
});

export const _AddPurchaseRequestModal: React.FC<OwnProps> = ({
  onClose,
  opened,
  title,
  companyId,
  projectId,
}) => {
  const { theme, classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const {
    companies,
    suppliers: suppliersList,
    purchaseRequestStatus: purchaseRequestStatusList,
    purchaseCategories,
  } = useAppSelector(selectRecordsForDropdown);
  const { data: projects } = useAppSelector(selectLeads);
  const [isCreating, setIsCreating] = React.useState(false);
  const [projectsList, setProjectsList] = React.useState<IDropDownList>([]);
  const [_file, setFile] = React.useState<File>({} as File);

  const form = useFormik<IRequestForm>({
    initialValues: {
      quotation: "",
      projectId: projectId || "",
      supplierId: "",
      customerId: companyId || "",
      categoryId: "",
      itemName: "",
      itemType: "",
      warranty: "",
      price: {
        amount: 0,
        currency: "MYR",
      },
      quantity: 0,
      remarks: "",
      status: 1,
    },
    validationSchema: schema,
    onSubmit: (values, helpers) => {
      console.log(values);
      setIsCreating((_prev) => true);
      dispatch(
        createPurchaseRequest({
          token,
          purchase: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Purchase Request", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addPurchaseRequest({ ...res.data, categoryId: values.categoryId }));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Purchase Request: ", err?.message);
          notify("Purchase Request", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Company logo not uploaded", "error");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, quotation: dataUri, hasLogo: true }));
        notify("Quotation Upload", "File uploaded successfully", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOnChangeCompany = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      customerId: value,
    }));
    const project_s = projects
      .filter((project) => project.customerId === value)
      .map((project) => ({
        label: project.name,
        value: project._id,
      }));
    setProjectsList(project_s);
  };

  const handleOnChangeProject = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      projectId: value,
    }));
  };

  const handleOnChangeSupplier = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      supplierId: value,
    }));
  };

  const handleOnChangeWarrantyDate = (value: DateValue) => {
    if (value) {
      form.setValues((prev) => ({
        ...prev,
        warranty: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleOnChangePriceCurrency = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      price: { ...prev.price, currency: value },
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      status: parseInt(value),
    }));
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (!companyId) return;
    const project_s = projects
      .filter((project) => project.customerId === companyId)
      .map((project) => ({
        label: project.name,
        value: project._id,
      }));
    setProjectsList(project_s);
  }, [companyId, projects, opened]);

  React.useEffect(() => {
    if (!companyId || !projectId) {
      return;
    }
    form.setValues((prev) => ({
      ...prev,
      customerId: companyId,
      projectId: projectId,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, projectId, opened]);

  return (
    <Modal
      size="xl"
      // fullScreen
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Grid>
        <Grid.Col span={12}>
          <Stack>
            <Flex direction={"column"} align={"center"} justify={"flex-end"}>
              {form.values.quotation ? (
                <Avatar src={"success.png"} radius={"md"} size={rem(170)} />
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
              <div className={classes.fileUploadButton}>
                <FileButton onChange={handleFileChange} accept="application/pdf">
                  {(props) => (
                    <Button
                      radius={"xl"}
                      variant="filled"
                      color={theme.primaryColor}
                      {...props}
                      rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                    >
                      Quotation
                    </Button>
                  )}
                </FileButton>
              </div>
            </Flex>
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No company found"
              label="Company"
              value={form.values.customerId}
              onChange={handleOnChangeCompany}
              data={companies}
              error={
                form.errors.customerId && form.touched.customerId
                  ? `${form.errors.customerId}`
                  : null
              }
            />
            <Group grow align="flex-start">
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Project Found"
                label="Project"
                value={form.values.projectId.toString()}
                onChange={handleOnChangeProject}
                data={projectsList}
                error={
                  form.errors.projectId && form.touched.projectId
                    ? `${form.errors.projectId}`
                    : null
                }
              />
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No suppliers"
                label="Supplier"
                value={form.values.supplierId.toString()}
                onChange={handleOnChangeSupplier}
                data={suppliersList}
                error={
                  form.errors.supplierId && form.touched.supplierId
                    ? `${form.errors.supplierId}`
                    : null
                }
              />
            </Group>
            <TextInput
              required
              withAsterisk={false}
              label="Item Name"
              name="itemName"
              id="itemName"
              value={form.values.itemName}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.errors.itemName && form.touched.itemName ? `${form.errors.itemName}` : null
              }
            />

            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Item Type"
                name="itemType"
                id="itemType"
                value={form.values.itemType}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.itemType && form.touched.itemType ? `${form.errors.itemType}` : null
                }
              />

              <DatePickerInput
                required
                withAsterisk={false}
                placeholder="Select Warranty Date"
                name="warranty"
                id="warranty"
                label="Warranty"
                onBlur={form.handleBlur}
                onChange={handleOnChangeWarrantyDate}
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                error={
                  form.touched.warranty && form.errors.warranty ? `${form.errors.warranty}` : null
                }
              />
            </Group>
            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Quantity"
                name="quantity"
                id="quantity"
                type="number"
                value={form.values.quantity}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.quantity && form.touched.quantity ? `${form.errors.quantity}` : null
                }
              />

              <TextInput
                required
                withAsterisk={false}
                label="Price"
                name="price.amount"
                id="price.amount"
                type="number"
                value={form.values.price.amount}
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
                    value={form.values.price.currency}
                    onChange={handleOnChangePriceCurrency}
                    data={currencyList}
                  />
                }
                error={
                  form.errors.price?.currency && form.touched.price?.currency
                    ? `${form.errors.price.currency}`
                    : null
                }
              />
            </Group>
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No status"
              label="Status"
              value={form.values.status.toString()}
              onChange={handleOnChangeStatus}
              data={purchaseRequestStatusList}
              error={form.errors.status && form.touched.status ? `${form.errors.status}` : null}
            />

            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No category found"
              label="Category"
              value={form.values.categoryId}
              onChange={(value) => {
                if (!value) {
                  return;
                }
                form.setValues((prev) => ({ ...prev, categoryId: value }));
              }}
              data={purchaseCategories}
              error={
                form.errors.categoryId && form.touched.categoryId
                  ? `${form.errors.categoryId}`
                  : null
              }
            />

            <Textarea
              minRows={5}
              maxRows={5}
              label="Remarks"
              name="remarks"
              id="remarks"
              value={form.values.remarks}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.remarks && form.touched.remarks ? `${form.errors.remarks}` : null}
            />
          </Stack>

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
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default _AddPurchaseRequestModal;

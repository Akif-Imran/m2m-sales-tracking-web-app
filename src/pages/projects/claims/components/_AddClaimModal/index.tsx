import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { selectProjects, selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addClaim } from "@slices";
import { IconCalendar } from "@tabler/icons-react";
import { currencyList } from "@constants";
import { colors } from "@theme";
import * as yup from "yup";
import { createClaim } from "@thunks";
import { notify } from "@utility";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId?: string;
}
interface IRequestForm
  extends Omit<IClaim, "_id" | "__v" | "createdAt" | "createdBy" | "isActive" | "company"> {}

const schema: yup.ObjectSchema<IRequestForm> = yup.object().shape({
  customerId: yup.string().required("Company is required"),
  projectId: yup.string().required("Project is required"),
  supplierId: yup.string().required("Supplier is required"),
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

export const _AddClaimModal: React.FC<OwnProps> = ({ onClose, opened, title, companyId }) => {
  const { theme } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = React.useState(false);
  const {
    suppliers: suppliersList,
    companies: companiesList,
    purchaseRequestStatus: purchaseRequestStatusList,
  } = useAppSelector(selectRecordsForDropdown);
  const { data: projects } = useAppSelector(selectProjects);
  const [projectsList, setProjectsList] = React.useState<IDropDownList>([]);

  const form = useFormik<IRequestForm>({
    initialValues: {
      projectId: "",
      customerId: "",
      supplierId: "",
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
        createClaim({
          token,
          claim: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Claim", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addClaim(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Claim: ", err?.message);
          notify("Claim", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleOnChangeCompany = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      customerId: value,
    }));
    const project_s = projects
      .filter((project) => project.customerId === value)
      .map((project) => ({
        value: project._id,
        label: project.name,
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
    const typeName = purchaseRequestStatusList.find((status) => status.value === value)?.label;
    if (!typeName) return;
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
        value: project._id,
        label: project.name,
      }));
    setProjectsList(project_s);
  }, [companyId, opened, projects]);

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
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No company found"
              label="Company"
              value={form.values.customerId}
              onChange={handleOnChangeCompany}
              data={companiesList}
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
                nothingFound="No project found"
                label="Project"
                value={form.values.projectId}
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
                nothingFound="No suppliers found"
                label="Supplier"
                value={form.values.supplierId}
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
                dropdownType="modal"
                withAsterisk={false}
                placeholder="Select Warranty Date"
                name="warranty"
                id="warranty"
                label="Warranty"
                onBlur={form.handleBlur}
                onChange={handleOnChangeWarrantyDate}
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                error={
                  form.errors.warranty && form.touched.warranty ? `${form.errors.warranty}` : null
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
                  form.errors.price?.amount && form.touched.price?.amount
                    ? `${form.errors.price?.amount}`
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

export default _AddClaimModal;

import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { selectProjects, selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addPurchaseRequest } from "@slices";
import { IconCalendar } from "@tabler/icons-react";
import { currencyList } from "@constants";
import { colors } from "@theme";
import { createPurchaseRequest } from "@thunks";
import { notify } from "@utility";

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
  > {}

export const _AddPurchaseRequestModal: React.FC<OwnProps> = ({
  onClose,
  opened,
  title,
  companyId,
  projectId,
}) => {
  const { theme } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const {
    companies,
    suppliers: suppliersList,
    purchaseRequestStatus: purchaseRequestStatusList,
  } = useAppSelector(selectRecordsForDropdown);
  const { data: projects } = useAppSelector(selectProjects);
  const [isCreating, setIsCreating] = React.useState(false);
  const [projectsList, setProjectsList] = React.useState<IDropDownList>([]);

  const form = useFormik<IRequestForm>({
    initialValues: {
      projectId: projectId || "",
      supplierId: "",
      customerId: companyId || "",
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
            dispatch(addPurchaseRequest(res.data));
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
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No company found"
              label="Company"
              value={form.values.customerId}
              onChange={handleOnChangeCompany}
              data={companies}
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

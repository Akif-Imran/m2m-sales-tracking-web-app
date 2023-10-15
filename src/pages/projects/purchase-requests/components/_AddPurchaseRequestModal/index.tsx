import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addPurchaseRequest } from "@slices";
import { IconCalendar } from "@tabler/icons-react";
import { currencyList } from "@constants";
import { colors } from "@theme";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId?: string;
}
interface IRequestForm extends Omit<IPurchaseRequest, "id"> {}

export const _AddPurchaseRequestModal: React.FC<OwnProps> = ({ onClose, opened, title }) => {
  const { theme } = useStyles();
  const {
    state: { user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const {
    suppliers: suppliersList,
    projects: projectsList,
    purchaseRequestStatus: purchaseRequestStatusList,
  } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IRequestForm>({
    initialValues: {
      projectId: "",
      supplierId: "",
      itemName: "",
      itemType: "",
      price: {
        amount: 0,
        currency: "MYR",
      },
      qty: 0,
      remarks: "",
      requestedById: user!._id,
      statusId: 1,
      statusName: "",
      warranty: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      dispatch(addPurchaseRequest(values));
      helpers.resetForm();
      onClose();
    },
  });

  const handleOnChangeProject = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      projectId: parseInt(value),
    }));
  };

  const handleOnChangeSupplier = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      supplierId: parseInt(value),
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
      statusId: parseInt(value),
      statusName: typeName,
    }));
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

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
                name="qty"
                id="qty"
                type="number"
                value={form.values.qty}
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
              value={form.values.statusId.toString()}
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
            <Button variant="filled" onClick={() => form.handleSubmit()} size="xs">
              Save
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default _AddPurchaseRequestModal;

import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Grid, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { useFormik } from "formik";
import { IconCalendar } from "@tabler/icons-react";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addProject } from "@slices";
import { DateTime } from "luxon";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { colors } from "@theme";
import { createProject } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { currencyList } from "@constants";
import * as yup from "yup";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IProjectForm
  extends Omit<
    IProject,
    "_id" | "__v" | "company" | "createdAt" | "createdBy" | "isActive" | "updatedAt" | "deletedAt"
  > {}

const schema: yup.ObjectSchema<IProjectForm> = yup.object().shape({
  name: yup.string().required("Project name is required"),
  description: yup.string().required("Project description is required"),
  type: yup.string().required("Project type is required"),
  costing: yup.object().nullable(),
  value: yup.object().shape({
    amount: yup.number().required("Value is required"),
    currency: yup.string().required("Currency is required"),
  }),
  contractDate: yup.string().required("Contract date is required"),
  deliveryDate: yup.string().required("Delivery date is required"),
  quotation: yup.number().required("Quotation is required"),
  salesPerson: yup.string().required("Sales person is required"),
  status: yup.number().required("Status is required"),
  customerId: yup.string().required("Customer is required"),
});

const _AddProjectModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [isCreating, setIsCreating] = React.useState(false);
  const [contractDate, setContractDate] = React.useState(new Date());
  const [deliveryDate, setDeliveryDate] = React.useState(new Date());
  const {
    companies: companiesList,
    salesPersons: salesPersonsList,
    projectStatus: projectStatusList,
  } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IProjectForm>({
    initialValues: {
      name: "",
      description: "",
      type: "",
      costing: null,
      value: {
        amount: 0,
        currency: "MYR",
      },
      contractDate: DateTime.now().toFormat("yyyy-MM-dd"),
      deliveryDate: DateTime.now().toFormat("yyyy-MM-dd"),
      quotation: 0,
      salesPerson: "",
      status: 0,
      customerId: "",
    },
    validationSchema: schema,
    onSubmit(values, helpers) {
      console.log(values);
      setIsCreating((_prev) => true);
      dispatch(
        createProject({
          token,
          project: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Project", res.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addProject(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Project: ", err?.message);
          notify("Project", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleOnChangeCompany = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      customerId: value,
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    const typeName = projectStatusList.find((status) => status.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      status: parseInt(value),
    }));
  };

  const handleOnChangeValueCurrency = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      value: { ...prev.value, currency: value },
    }));
  };

  const handleOnChangeContractDate = (value: DateValue) => {
    if (value) {
      setContractDate(value);
      form.setValues((prev) => ({
        ...prev,
        contractDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleOnChangeDeliveryDate = (value: DateValue) => {
    if (value) {
      setDeliveryDate(value);
      form.setValues((prev) => ({
        ...prev,
        deliveryDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleOnChangeSalesPerson = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      salesPerson: value,
    }));
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
              error={form.touched.name && form.errors.name ? `${form.errors.name}` : null}
            />
            <Textarea
              minRows={5}
              maxRows={5}
              label="Description"
              name="description"
              id="description"
              value={form.values.description}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.description && form.errors.description
                  ? `${form.errors.description}`
                  : null
              }
            />
            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Project Type"
                name="type"
                id="type"
                value={form.values.type}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.type && form.errors.type ? `${form.errors.type}` : null}
              />
              <TextInput
                required
                withAsterisk={false}
                label="Value"
                name="value.amount"
                id="value.amount"
                type="number"
                value={form.values.value.amount}
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
                    value={form.values.value.currency}
                    onChange={handleOnChangeValueCurrency}
                    data={currencyList}
                  />
                }
                error={
                  form.touched?.value?.amount && form.errors?.value?.amount
                    ? `${form.errors?.value?.amount}`
                    : null
                }
              />
            </Group>
            <Group grow align="flex-start">
              <DatePickerInput
                radius={"md"}
                required
                withAsterisk={false}
                name="contractDate"
                id="contractDate"
                label="Contract Date"
                onBlur={form.handleBlur}
                defaultValue={contractDate}
                onChange={handleOnChangeContractDate}
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                error={
                  form.touched.contractDate && form.errors.contractDate
                    ? `${form.errors.contractDate}`
                    : null
                }
              />
              <DatePickerInput
                radius={"md"}
                required
                withAsterisk={false}
                name="deliveryDate"
                id="deliveryDate"
                label="Delivery Date"
                onBlur={form.handleBlur}
                defaultValue={deliveryDate}
                onChange={handleOnChangeDeliveryDate}
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                error={
                  form.touched.deliveryDate && form.errors.deliveryDate
                    ? `${form.errors.deliveryDate}`
                    : null
                }
              />
            </Group>
            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Quotation"
                name="quotation"
                id="quotation"
                type="number"
                value={form.values.quotation}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.quotation && form.errors.quotation
                    ? `${form.errors.quotation}`
                    : null
                }
              />
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Sales Persons"
                label="Sales Person"
                value={form.values.salesPerson}
                onChange={handleOnChangeSalesPerson}
                data={salesPersonsList}
                error={
                  form.touched.salesPerson && form.errors.salesPerson
                    ? `${form.errors.salesPerson}`
                    : null
                }
              />
            </Group>
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No Companies"
              label="Company"
              value={form.values.customerId}
              onChange={handleOnChangeCompany}
              data={companiesList}
              error={
                form.touched.customerId && form.errors.customerId
                  ? `${form.errors.customerId}`
                  : null
              }
            />
            <Select
              required
              withAsterisk={false}
              searchable
              nothingFound="No Such Status"
              label="Project Status"
              value={form.values.status.toString()}
              onChange={handleOnChangeStatus}
              data={projectStatusList}
              error={form.touched.status && form.errors.status ? `${form.errors.status}` : null}
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
    </Modal>
  );
};

export { _AddProjectModal };

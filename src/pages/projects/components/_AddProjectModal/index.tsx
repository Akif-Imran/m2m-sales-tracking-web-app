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

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IProjectForm extends Omit<IProject, "id"> {}

const _AddProjectModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const [contractDate, setContractDate] = React.useState(new Date());
  const [deliveryDate, setDeliveryDate] = React.useState(new Date());
  const {
    companies: companiesList,
    salesPersons: salesPersonsList,
    projectStatus: projectStatusList,
  } = useAppSelector(selectRecordsForDropdown);
  const currencyList = [
    { label: "MYR", value: "MYR" },
    { label: "USD", value: "USD" },
    { label: "CAD", value: "CAD" },
  ];

  const form = useFormik<IProjectForm>({
    initialValues: {
      name: "",
      description: "",
      projectType: "",
      value: {
        amount: 0,
        currency: "MYR",
      },
      contractDate: DateTime.now().toFormat("yyyy-MM-dd"),
      deliveryDate: DateTime.now().toFormat("yyyy-MM-dd"),
      quotation: "",
      salesPersonId: 0,
      statusId: 0,
      statusName: "",
      companyId: 0,
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addProject(values));
      helpers.resetForm();
      onClose();
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
      companyId: parseInt(value),
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    const typeName = projectStatusList.find((status) => status.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      statusId: parseInt(value),
      statusName: typeName,
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
      salesPersonId: parseInt(value),
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
              />
              <Textarea
                rows={5}
                label="Description"
                name="description"
                id="description"
                value={form.values.description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Project Type"
                  name="projectType"
                  id="projectType"
                  value={form.values.projectType}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Value"
                  name="value.amount"
                  id="value.amount"
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
                  value={form.values.quotation}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Sales Persons"
                  label="Sales Person"
                  value={form.values.salesPersonId.toString()}
                  onChange={handleOnChangeSalesPerson}
                  data={salesPersonsList}
                />
              </Group>
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Companies"
                label="Company"
                value={form.values.companyId.toString()}
                onChange={handleOnChangeCompany}
                data={companiesList}
              />
              <Select
                required
                withAsterisk={false}
                searchable
                nothingFound="No Such Status"
                label="Project Status"
                value={form.values.statusId.toString()}
                onChange={handleOnChangeStatus}
                data={projectStatusList}
              />

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button variant="filled" onClick={() => form.handleSubmit()} size="xs">
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

export { _AddProjectModal };

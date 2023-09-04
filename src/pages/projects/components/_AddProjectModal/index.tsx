import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Divider,
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
import { useFormik } from "formik";
import { IconCalendar, IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addProject } from "@slices";
import { DateTime } from "luxon";
import { DatePickerInput } from "@mantine/dates";
import { colors } from "@theme";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface IProjectForm extends Omit<IProject, "id"> {}

const _AddProjectModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme, classes } = useStyles();
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = React.useState(new Date());
  const [plannedEndDate, setPlannedEndDate] = React.useState(new Date());
  const {
    companies: companiesList,
    salesPersons: salesPersonsList,
    projectManagers: projectManagersList,
    projectStatus: projectStatusList,
  } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IProjectForm>({
    initialValues: {
      logo: "",
      name: "",
      companyId: 0,
      statusId: 0,
      statusName: "",
      projectType: "",
      projectManagerId: 0,
      salesPersonId: 0,
      value: 0,
      city: "",
      startDate: DateTime.now().toFormat("yyyy-MM-dd"),
      plannedEndDate: DateTime.now().toFormat("yyyy-MM-dd"),
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addProject(values));
      helpers.resetForm();
      onClose();
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Vehicle image not uploaded", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, logo: dataUri }));
      }
    };
    reader.readAsDataURL(file);
    // const fileUri = URL.createObjectURL(file);
    // setFileUri(fileUri);
  };

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

  const handleOnChangeSalesPerson = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      salesPersonId: parseInt(value),
    }));
  };

  const handleOnChangeProjectManager = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      projectManagerId: parseInt(value),
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
        <Flex direction={"column"} align={"center"} justify={"flex-end"}>
          {form.values.logo ? (
            <Avatar src={form.values.logo} radius={rem(250)} size={rem(170)} />
          ) : (
            <Avatar src={"/user.png"} radius={rem(250)} size={rem(170)} />
          )}
          <div className={classes.fileUploadButton}>
            <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  radius={"xl"}
                  variant="filled"
                  color={theme.primaryColor}
                  {...props}
                  rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                >
                  Logo
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
        <Grid columns={25}>
          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="Project" labelPosition="center" />
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
                  label="City"
                  name="city"
                  id="city"
                  value={form.values.city}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
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
            </Stack>
          </Grid.Col>

          <Grid.Col span={1} />

          <Grid.Col span={12}>
            <Stack spacing={"xs"}>
              <Divider label="Details" labelPosition="center" />
              <Group grow align="flex-start">
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
                <Select
                  required
                  withAsterisk={false}
                  searchable
                  nothingFound="No Project Managers"
                  label="Project Managers"
                  value={form.values.projectManagerId.toString()}
                  onChange={handleOnChangeProjectManager}
                  data={projectManagersList}
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Value (RM)"
                name="value"
                id="value"
                type="number"
                value={form.values.value.toString()}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <DatePickerInput
                radius={"md"}
                required
                withAsterisk={false}
                name="startDate"
                id="startDate"
                label="Start Date"
                onBlur={form.handleBlur}
                defaultValue={startDate}
                onChange={(value) => {
                  if (value) {
                    setStartDate(value);
                    form.setValues((prev) => ({
                      ...prev,
                      startDate: DATE_FORMAT_YYYY_MM_DD(value),
                    }));
                  }
                }}
                error={
                  form.touched.startDate && form.errors.startDate
                    ? `${form.errors.startDate}`
                    : null
                }
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
              />
              <DatePickerInput
                radius={"md"}
                required
                withAsterisk={false}
                name="plannedEndDate"
                id="plannedEndDate"
                label="Planned End Date"
                onBlur={form.handleBlur}
                defaultValue={plannedEndDate}
                onChange={(value) => {
                  if (value) {
                    setPlannedEndDate(value);
                    form.setValues((prev) => ({
                      ...prev,
                      plannedEndDate: DATE_FORMAT_YYYY_MM_DD(value),
                    }));
                  }
                }}
                error={
                  form.touched.plannedEndDate && form.errors.plannedEndDate
                    ? `${form.errors.plannedEndDate}`
                    : null
                }
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
              />
              {/* <TextInput
                required
                withAsterisk={false}
                label="Designation"
                name="contact.designation"
                id="contact.designation"
                value={company.values.contact.designation}
                onChange={company.handleChange}
                onBlur={company.handleBlur}
              /> */}

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

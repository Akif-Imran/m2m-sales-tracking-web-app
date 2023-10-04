import { DATE_FORMAT_YYYY_MM_DD_HH_MM_SS, modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { useFormik } from "formik";
import { IconCalendar } from "@tabler/icons-react";
import { notify } from "@utility";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addTask } from "@slices";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mantine/dates";
import { colors } from "@theme";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface ITaskForm extends Omit<ITask, "id"> {}

const _AddTaskModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const [plannedEndDate, setPlannedEndDate] = React.useState(new Date());
  const { taskStatus, projects, salesPersons, projectManagers } =
    useAppSelector(selectRecordsForDropdown);

  const form = useFormik<ITaskForm>({
    initialValues: {
      statusId: 1,
      statusName: "",
      projectId: 0,
      title: "",
      description: "",
      assigneeId: 0,
      createdDate: new Date().toUTCString(),
      plannedEndDate: DateTime.now().toISO() || "",
      completedDate: "",
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addTask({ ...values, createdDate: DateTime.now().toISO() || "" }));
      notify("Add Task", "Task added successfully", "success");
      helpers.resetForm();
      onClose();
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleOnChangeProject = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      projectId: parseInt(value),
    }));
  };

  const handleOnChangeAssignee = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      assigneeId: parseInt(value),
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    const typeName = taskStatus.find((status) => status.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      statusId: parseInt(value),
      statusName: typeName,
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
        <Group grow align="flex-start">
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No Users"
            label="Assign to"
            value={form.values.assigneeId.toString()}
            onChange={handleOnChangeAssignee}
            data={[...salesPersons, ...projectManagers]}
          />
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No Project"
            label="Project"
            value={form.values.projectId.toString()}
            onChange={handleOnChangeProject}
            data={projects}
          />
        </Group>
        <TextInput
          required
          withAsterisk={false}
          label="Title"
          name="title"
          id="title"
          value={form.values.title}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Textarea
          required
          withAsterisk={false}
          label="Description"
          name="description"
          id="description"
          value={form.values.description}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Group grow align="flex-start">
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No Status"
            label="Status"
            value={form.values.statusId.toString()}
            onChange={handleOnChangeStatus}
            data={taskStatus}
          />
          <DateTimePicker
            required
            withAsterisk={false}
            name="plannedEndDate"
            id="plannedEndDate"
            label="Deadline"
            onBlur={form.handleBlur}
            defaultValue={plannedEndDate}
            onChange={(value) => {
              if (value) {
                setPlannedEndDate(value);
                form.setValues((prev) => ({
                  ...prev,
                  plannedEndDate: DATE_FORMAT_YYYY_MM_DD_HH_MM_SS(value),
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
        </Group>

        <Group align="flex-end" position="right" mt={rem(32)}>
          <Button variant="outline" onClick={handleCancel} size="xs">
            Cancel
          </Button>
          <Button variant="filled" onClick={() => form.handleSubmit()} size="xs">
            Assign
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { _AddTaskModal };

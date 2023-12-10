import { DATE_FORMAT_YYYY_MM_DD_HH_MM_SS, modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Button, Group, Modal, Select, Stack, TextInput, Textarea, rem } from "@mantine/core";
import { useFormik } from "formik";
import { IconCalendar } from "@tabler/icons-react";
import { notify } from "@utility";
import {
  selectLeadsWithRecords,
  selectModule,
  selectProjectsWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { addTask } from "@slices";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mantine/dates";
import { colors } from "@theme";
import { createTask } from "@thunks";
import { useAuthContext } from "@contexts";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
interface ITaskForm
  extends Omit<ITask, "_id" | "__v" | "company" | "isActive" | "createdBy" | "createdAt"> {}

const _AddTaskModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [plannedEndDate, setPlannedEndDate] = React.useState(new Date());
  const { module } = useAppSelector(selectModule);
  const prospects = useAppSelector(selectLeadsWithRecords);
  const projects = useAppSelector(selectProjectsWithRecords);
  const { companies, salesPersons, engineers } = useAppSelector(selectRecordsForDropdown);
  const [projectsLeadList, setProjectsLeadList] = React.useState<IDropDownList>([]);
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useFormik<ITaskForm>({
    initialValues: {
      projectId: "",
      customerId: "",
      title: "",
      description: "",
      assignedTo: "",
      completionDeadline: DateTime.now().toISO() || "",
      status: 1,
    },
    onSubmit(values, helpers) {
      console.log(values);
      setIsCreating((_prev) => true);
      dispatch(
        createTask({
          token,
          task: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Add Task", res?.message, res.success ? "success" : "error");
          if (res.success) {
            dispatch(addTask(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Task: ", err?.message);
          notify("Add Task", "An error occurred", "error");
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

  const handleOnChangeProject = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      projectId: value,
    }));
  };

  const handleOnChangeAssignee = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      assignedTo: value,
    }));
  };

  const handleOnChangeCompany = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      customerId: value,
    }));
    if (module === "crm") {
      const prospect_s = prospects
        .filter((prospect) => prospect.customerId === value)
        .map((project) => ({
          value: project._id,
          label: project.name,
        }));
      setProjectsLeadList(prospect_s);
    } else if (module === "project") {
      const project_s = projects
        .filter((project) => project.customerId === value)
        .map((project) => ({
          value: project._id,
          label: project.name,
        }));
      setProjectsLeadList(project_s);
    }
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
            withinPortal
            required
            withAsterisk={false}
            searchable
            nothingFound="No contacts found"
            label="Contact"
            value={form.values.customerId}
            onChange={handleOnChangeCompany}
            data={companies}
          />

          <Select
            withinPortal
            required
            withAsterisk={false}
            searchable
            nothingFound="No record found"
            label={module === "crm" ? "Prospect" : "Project"}
            value={form.values.projectId.toString()}
            onChange={handleOnChangeProject}
            data={projectsLeadList}
          />
        </Group>

        <TextInput
          required
          withAsterisk={false}
          label="Task Title"
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
            withinPortal
            required
            withAsterisk={false}
            searchable
            nothingFound="No Users"
            label="Assign to"
            value={form.values.assignedTo}
            onChange={handleOnChangeAssignee}
            //TODO - might need a fix to include all users
            data={[...salesPersons, ...engineers]}
          />
          <DateTimePicker
            dropdownType="modal"
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
                  completionDeadline: DATE_FORMAT_YYYY_MM_DD_HH_MM_SS(value),
                }));
              }
            }}
            error={
              form.touched.completionDeadline && form.errors.completionDeadline
                ? `${form.errors.completionDeadline}`
                : null
            }
            icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
          />
        </Group>

        <Group align="flex-end" position="right" mt={rem(32)}>
          <Button variant="outline" onClick={handleCancel} size="xs">
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={() => form.handleSubmit()}
            size="xs"
            loading={isCreating}
          >
            Assign
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { _AddTaskModal };

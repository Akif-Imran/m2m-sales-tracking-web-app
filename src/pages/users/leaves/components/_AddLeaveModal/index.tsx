import React from "react";
import { useStyles } from "./styles";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import {
  Avatar,
  Button,
  FileButton,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { DATE_FORMAT_YYYY_MM_DD, modalOverlayPropsHelper } from "@helpers";
import { useGStyles } from "@global-styles";
import { IconCalendar, IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { colors } from "@theme";
import { createLeave } from "@thunks";
import { addLeave } from "@slices";
import { uploadFile } from "@services";
import * as yup from "yup";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

interface ILeaveForm
  extends Omit<
    ILeaveApplication,
    "_id" | "__v" | "isActive" | "createdBy" | "createdAt" | "company" | "remarks"
  > {
  hasDocument: boolean;
}

const schema: yup.ObjectSchema<ILeaveForm> = yup.object().shape({
  document: yup.string().required("Type is required").nullable(),
  hasDocument: yup.boolean().required("Type is required"),
  name: yup.string().required("Name is required"),
  reason: yup.string().required("Reason is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  status: yup.number().required("Status is required").min(1).max(3),
  type: yup.string().required("Type is required"),
});

const _AddLeaveModal: React.FC<OwnProps> = ({ onClose, opened, title }) => {
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const {
    state: { token },
  } = useAuthContext();
  const { leaveStatus, leaveTypes } = useAppSelector(selectRecordsForDropdown);
  const leaveStatusList = leaveStatus.filter((status) => status.label === "Pending");
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = React.useState(false);
  const [file, setFile] = React.useState<File>({} as File);

  const form = useFormik<ILeaveForm>({
    initialValues: {
      document: "",
      hasDocument: false,
      name: "",
      reason: "",
      startDate: "",
      endDate: "",
      status: 1,
      type: "Paid",
    },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      console.log(values);
      setIsCreating((_prev) => true);
      if (values.hasDocument) {
        const res = await uploadFile(token, file);
        if (res.statusCode === 200 || res.statusCode === 201) {
          values.document = res.data;
        } else {
          setIsCreating((_prev) => false);
          notify("Add Leave", res?.message, "error");
          return;
        }
      }
      dispatch(
        createLeave({
          token,
          leave: values,
        })
      )
        .unwrap()
        .then((res) => {
          notify("Add Leave", res?.message, res?.success ? "success" : "error");
          if (res.success) {
            dispatch(addLeave(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add leave: ", err?.message);
          notify("Add Leave", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Proof Upload", "Proof image not uploaded", "error");
      return;
    }
    setFile((_prev) => file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, document: dataUri, hasDocument: true }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOnChangeType = (value: string | null) => {
    if (!value) return;
    const typeName = leaveTypes.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      type: typeName,
    }));
  };

  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    const typeName = leaveStatus.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      status: parseInt(value),
    }));
  };

  const handleOnChangeStartDate = (value: DateValue) => {
    if (value) {
      form.setValues((prev) => ({
        ...prev,
        startDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleOnChangeEndDate = (value: DateValue) => {
    if (value) {
      form.setValues((prev) => ({
        ...prev,
        endDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Modal
      size="xl"
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack>
        <Flex direction={"column"} align={"center"} justify={"flex-end"}>
          {form.values.document ? (
            <Avatar src={`${form.values.document}`} radius={"md"} size={rem(170)} />
          ) : (
            <Avatar src={"/user.png"} radius={rem(250)} size={rem(170)} />
          )}
          <div className={gclasses.fileUploadButton}>
            <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  radius={"xl"}
                  variant="filled"
                  color={theme.primaryColor}
                  {...props}
                  rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                >
                  Proof
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
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
        <Group grow align="flex-start">
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No such type"
            label="Type"
            value={form.values.type}
            onChange={handleOnChangeType}
            data={leaveTypes}
            error={form.touched.type && form.errors.type ? `${form.errors.type}` : null}
          />
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No such status"
            label="Status"
            value={form.values.status.toString()}
            onChange={handleOnChangeStatus}
            data={leaveStatusList}
            error={form.touched.status && form.errors.status ? `${form.errors.status}` : null}
          />
        </Group>
        <Group grow align="flex-start">
          <DatePickerInput
            required
            withAsterisk={false}
            placeholder="Select Start Date"
            name="startDate"
            id="startDate"
            label="Start Date"
            onBlur={form.handleBlur}
            onChange={handleOnChangeStartDate}
            icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
            error={
              form.touched.startDate && form.errors.startDate ? `${form.errors.startDate}` : null
            }
          />
          <DatePickerInput
            required
            withAsterisk={false}
            placeholder="Select End Date"
            name="endDate"
            id="endDate"
            label="End Date"
            onBlur={form.handleBlur}
            onChange={handleOnChangeEndDate}
            icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
            error={form.touched.endDate && form.errors.endDate ? `${form.errors.endDate}` : null}
          />
        </Group>
        <Textarea
          minRows={5}
          maxRows={5}
          label="Reason"
          name="reason"
          id="reason"
          value={form.values.reason}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.reason && form.errors.reason ? `${form.errors.reason}` : null}
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
    </Modal>
  );
};

export { _AddLeaveModal };

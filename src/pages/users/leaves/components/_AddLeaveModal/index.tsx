import React from "react";
import { useStyles } from "./styles";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addLeave } from "@slices";
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

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

interface ILeaveForm extends Omit<ILeaveApplication, "id"> {}

const _AddLeaveModal: React.FC<OwnProps> = ({ onClose, opened, title }) => {
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const {
    state: { user },
  } = useAuthContext();
  const { leaveStatus, leaveTypes } = useAppSelector(selectRecordsForDropdown);
  const leaveStatusList = leaveStatus.filter((status) => status.label === "Pending");
  const dispatch = useAppDispatch();

  const form = useFormik<ILeaveForm>({
    initialValues: {
      proof: "",
      name: "",
      reason: "",
      startDate: "",
      endDate: "",
      remarks: "",
      requestedById: user!.id,
      statusId: 1,
      statusName: "Pending",
      typeId: 1,
      typeName: "Paid",
    },
    onSubmit(values, helpers) {
      console.log(values);
      dispatch(addLeave(values));
      helpers.resetForm();
      onClose();
    },
  });

  const handleFileChange = (file: File) => {
    if (file === null) {
      notify("Proof Upload", "Proof image not uploaded", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, proof: dataUri }));
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
      typeId: parseInt(value),
      typeName: typeName,
    }));
  };
  const handleOnChangeStatus = (value: string | null) => {
    if (!value) return;
    const typeName = leaveStatus.find((type) => type.value === value)?.label;
    if (!typeName) return;
    form.setValues((prev) => ({
      ...prev,
      statusId: parseInt(value),
      statusName: typeName,
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
          {form.values.proof ? (
            <Avatar src={form.values.proof} radius={"md"} size={rem(170)} />
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
        />
        <Group grow align="flex-start">
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No such type"
            label="Type"
            value={form.values.typeId.toString()}
            onChange={handleOnChangeType}
            data={leaveTypes}
          />
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No such status"
            label="Status"
            value={form.values.statusId.toString()}
            onChange={handleOnChangeStatus}
            data={leaveStatusList}
          />
        </Group>
        <Group grow align="flex-start">
          <DatePickerInput
            required
            withAsterisk={false}
            placeholder="Select Start Date"
            name="warranty"
            id="warranty"
            label="Warranty"
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
    </Modal>
  );
};

export { _AddLeaveModal };

import { useGStyles } from "@global-styles";
import { modalOverlayPropsHelper } from "@helpers";
import { Modal, ScrollArea, Stack, Radio, Textarea, Group, rem, Button } from "@mantine/core";
import { updateLeaveStatus } from "@slices";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { notify } from "@utility";
import { useFormik } from "formik";
import React from "react";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  statusId: number;
  leaveId: number;
}
interface IForm {
  leaveId: number;
  statusId: number;
  statusName: string;
  remarks: string;
}

const _UpdateLeaveModal: React.FC<OwnProps> = ({ onClose, opened, title, leaveId, statusId }) => {
  const { theme, classes: gclasses } = useGStyles();
  const dispatch = useAppDispatch();
  const { leaveStatus } = useAppSelector(selectRecordsForDropdown);

  console.log(statusId, leaveId);

  const form = useFormik<IForm>({
    initialValues: {
      leaveId: leaveId,
      statusId: statusId,
      statusName: "",
      remarks: "",
    },
    onSubmit: (values, helpers) => {
      console.log(values);
      dispatch(updateLeaveStatus(values));
      helpers.resetForm();
      onClose();
    },
  });
  const handleOnChangeStatus = (value: string) => {
    if (!value) {
      notify("Update Purchase Request Status", "Invalid status value", "error");
      return;
    }
    const typeName = leaveStatus.find((status) => status.value === value)?.label;
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

  React.useEffect(() => {
    form.setValues((prev) => ({
      ...prev,
      statusId: statusId,
      leaveId: leaveId,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveId, statusId]);

  return (
    <Modal
      size={"lg"}
      radius="md"
      opened={opened}
      onClose={onClose}
      title={title}
      scrollAreaComponent={ScrollArea.Autosize}
      withinPortal
      withOverlay
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack>
        <Radio.Group
          name="leaveStatus"
          value={form.values.statusId.toString()}
          onChange={handleOnChangeStatus}
        >
          <div className={gclasses.radioContainerRow}>
            {leaveStatus.map((value) => {
              return <Radio value={value.value} label={value.label} key={value.value} />;
            })}
          </div>
        </Radio.Group>
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

export { _UpdateLeaveModal };

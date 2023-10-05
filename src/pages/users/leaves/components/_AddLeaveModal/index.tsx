import React from "react";
import { useStyles } from "./styles";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import { addLeave } from "@slices";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { Avatar, Button, FileButton, Flex, Group, Modal, Select, Stack, rem } from "@mantine/core";
import { modalOverlayPropsHelper } from "@helpers";
import { useGStyles } from "@global-styles";
import { IconUpload } from "@tabler/icons-react";
import { notify } from "@utility";

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
      statusName: "",
      typeId: 1,
      typeName: "",
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
                  Avatar
                </Button>
              )}
            </FileButton>
          </div>
        </Flex>
        <Group grow align="flex-start">
          <Select
            required
            withAsterisk={false}
            searchable
            nothingFound="No such type"
            label="type"
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
            data={leaveStatus}
          />
        </Group>
      </Stack>
    </Modal>
  );
};

export { _AddLeaveModal };

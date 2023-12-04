import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { Button, Group, Modal, Select, Stack, rem } from "@mantine/core";
import { FormikHelpers, useFormik } from "formik";
import { selectRecordsForDropdown, useAppDispatch, useAppSelector } from "@store";
import * as yup from "yup";
import { assignEngineer } from "@thunks";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";
import { modifyLead } from "@slices";
import { useGStyles } from "@global-styles";

type OwnProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  projectId: string;
};
interface IAssignEngineerForm {
  engineer: string;
}

const schema: yup.ObjectSchema<IAssignEngineerForm> = yup.object().shape({
  engineer: yup.string().required("Engineer is required"),
});

const _AssignEngineerModal: React.FC<OwnProps> = (props) => {
  const { opened, onClose, title } = props;
  const { theme } = useGStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token },
  } = useAuthContext();
  const [isCreating, setIsCreating] = React.useState(false);
  const { engineers } = useAppSelector(selectRecordsForDropdown);

  const form = useFormik<IAssignEngineerForm>({
    initialValues: {
      engineer: "",
    },
    validationSchema: schema,
    onSubmit: (values, helpers) => {
      console.log(values);
      handleAdd(values, helpers);
    },
  });

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const handleAdd = (values: IAssignEngineerForm, helpers: FormikHelpers<IAssignEngineerForm>) => {
    setIsCreating((_prev) => true);
    dispatch(
      assignEngineer({
        token,
        projectId: props.projectId,
        body: values,
      })
    )
      .unwrap()
      .then((res) => {
        notify("Assign Engineer", res?.message, res.success ? "success" : "error");
        if (res.success) {
          dispatch(modifyLead(res.data));
          helpers.resetForm();
          onClose();
        }
      })
      .catch((err) => {
        console.log("Assign Engineer: ", err?.message);
        notify("Assign Engineer", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleOnChangeEngineer = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      engineer: value,
    }));
  };

  return (
    <Modal
      size="md"
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack spacing={"xs"}>
        <Select
          required
          withAsterisk={false}
          searchable
          nothingFound="No engineers"
          label="Engineer"
          description="Select an engineer from the list to be assigned to project"
          placeholder="Select"
          value={form.values.engineer}
          onChange={handleOnChangeEngineer}
          data={engineers}
          error={form.touched.engineer && form.errors.engineer ? `${form.errors.engineer}` : null}
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

export { _AssignEngineerModal };

import { modalOverlayPropsHelper } from "@helpers";
import React from "react";
import { useStyles } from "./styles";
import { Modal, Stack, TextInput } from "@mantine/core";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}
const _AddCompanyModal: React.FC<OwnProps> = ({ opened, onClose, title }) => {
  const { theme } = useStyles();
  return (
    <Modal
      size="lg"
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Stack spacing={"xs"}>
        <TextInput required withAsterisk={false} label="Name" name="name" id="name" />
      </Stack>
    </Modal>
  );
};

export { _AddCompanyModal };

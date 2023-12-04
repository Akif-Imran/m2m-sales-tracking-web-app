import { modals } from "@mantine/modals";
import { MantineTheme, ModalBaseOverlayProps } from "@mantine/core";
import React from "react";

type ModalProps = {
  title: string;
  loading: boolean;
  description: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel: string;
  onCancel: () => void;
  theme: MantineTheme;
};

export const openDeleteModalHelper = ({
  title,
  loading,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
  theme,
}: ModalProps) => {
  modals.openConfirmModal({
    title: `${title}`,
    centered: true,
    children: description,
    labels: { confirm: `${confirmLabel}`, cancel: `${cancelLabel}` },
    overlayProps: modalOverlayPropsHelper(theme),
    radius: "md",
    shadow: "md",
    confirmProps: {
      color: "red",
      variant: "filled",
      loading: loading,
      radius: "md",
    },
    onCancel,
    cancelProps: { color: "red", variant: "outline", radius: "md" },
    onConfirm,
  });
};

export const openConfirmModalHelper = ({
  title,
  loading,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
  theme,
}: ModalProps) => {
  modals.openConfirmModal({
    title: `${title}`,
    centered: true,
    children: description,
    labels: { confirm: `${confirmLabel}`, cancel: `${cancelLabel}` },
    overlayProps: modalOverlayPropsHelper(theme),
    radius: "md",
    shadow: "md",
    confirmProps: {
      color: "blue",
      variant: "filled",
      loading: loading,
      radius: "md",
    },
    onCancel,
    cancelProps: { color: "blue", variant: "outline", radius: "md" },
    onConfirm,
  });
};

export const modalOverlayPropsHelper = (theme: MantineTheme): ModalBaseOverlayProps => {
  return {
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
    opacity: 0.55,
    blur: 3,
  };
};

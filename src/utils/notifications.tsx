import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";

export const notify = (title: string, message: string | undefined, type: "error" | "success") => {
  showNotification({
    autoClose: 3000,
    title: `${title}`,
    message: `${message || ""}`,
    color: type === "error" ? "red" : "blue",
    icon: type === "error" ? <IconX /> : <IconCheck />,
    className: "my-notification-class",
    loading: false,
  });
};

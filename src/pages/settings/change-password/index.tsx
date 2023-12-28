import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, Group, PasswordInput, Stack, Text, rem } from "@mantine/core";
import { colors } from "../../../theme";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { changePassword } from "@services";
import { useAuthContext } from "@contexts";
import { notify } from "@utility";

interface OwnProps {}
interface IForm {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

const schema = yup.object().shape({
  current_password: yup.string().required("Old Password is required"),
  new_password: yup
    .string()
    .required("New Password is required")
    .oneOf([yup.ref("confirm_new_password")], "New Passwords must match"),
  confirm_new_password: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("new_password")], "New Passwords must match"),
});

const ChangePassword: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { token },
    logout,
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useFormik<IForm>({
    initialValues: {
      confirm_new_password: "",
      new_password: "",
      current_password: "",
    },
    onSubmit: (values, helpers) => {
      fetchChangePassword(values, helpers);
    },
    validationSchema: schema,
  });

  const fetchChangePassword = (values: IForm, helpers: FormikHelpers<IForm>) => {
    setIsLoading(true);
    changePassword(token, {
      currentPassword: values.current_password,
      newPassword: values.new_password,
    })
      .then((res) => {
        notify("Change Password", res.message, res.success ? "success" : "error");
        if (res.success) {
          helpers.resetForm();
          logout();
        }
      })
      .catch((err) => {
        console.log("Change Password Error", err?.message);
        notify("Change Password", "An error occurred.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} m={"xs"} color={colors.titleText}>
          Change Password
        </Text>
        <Flex m={"xs"} direction={"column"} rowGap={"sm"}>
          <PasswordInput
            required
            withAsterisk={false}
            label="Current Password"
            name="current_password"
            id="current_password"
            value={form.values.current_password}
            placeholder="Current Password"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.current_password && form.errors.current_password
                ? `${form.errors.current_password}`
                : null
            }
            radius="md"
            styles={{
              input: {
                color: colors.titleText,
              },
              label: {
                color: colors.titleText,
              },
            }}
          />
          <PasswordInput
            required
            withAsterisk={false}
            label="New Password"
            name="new_password"
            id="new_password"
            value={form.values.new_password}
            placeholder="New Password"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.new_password && form.errors.new_password
                ? `${form.errors.new_password}`
                : null
            }
            radius="md"
            styles={{
              input: {
                color: colors.titleText,
              },
              label: {
                color: colors.titleText,
              },
            }}
          />
          <PasswordInput
            required
            withAsterisk={false}
            label="Confirm New Password"
            name="confirm_new_password"
            id="confirm_new_password"
            value={form.values.confirm_new_password}
            placeholder="Confirm New Password"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.confirm_new_password && form.errors.confirm_new_password
                ? `${form.errors.confirm_new_password}`
                : null
            }
            radius="md"
            styles={{
              input: {
                color: colors.titleText,
              },
              label: {
                color: colors.titleText,
              },
            }}
          />
          <Group position="right" align="flex-start">
            <Button variant="outline" radius={"md"} onClick={() => form.resetForm()}>
              Reset
            </Button>
            <Button
              loading={isLoading}
              variant="filled"
              radius={"md"}
              onClick={() => form.handleSubmit()}
            >
              Save
            </Button>
          </Group>
        </Flex>
      </Stack>
    </Card>
  );
};

export default ChangePassword;

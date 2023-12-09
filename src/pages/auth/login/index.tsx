import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  createStyles,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { routes } from "@routes";
import { useAuthContext } from "@contexts";

const useStyles = createStyles(() => ({
  mainContainer: {
    borderWidth: 1,
  },
}));

const Login: React.FC = () => {
  const { classes } = useStyles();
  const [rememberMe, setRememberMe] = React.useState(true);
  const {
    login,
    state: { isLoading, isAuthorized },
  } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = React.useMemo(() => location.state?.path || routes.home, [location.state]);
  // const redirectPath = routes.dashboard.home;

  const validationSchema = yup.object().shape({
    email: yup.string().email("Must be valid email!").required("Email is required!"),
    password: yup.string().min(2, "Too short!").required("Password is required!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, _helpers) => {
      console.log("onSubmit for login");
      login(values.email, values.password, rememberMe);
    },
    validationSchema: validationSchema,
  });

  /*   React.useLayoutEffect(() => {
    const creds = localStorage.getItem("login");
    if (!creds) return;
    const { email, password } = JSON.parse(creds);
    formik.initialValues.email = email;
    formik.initialValues.password = password;
  }, []); */

  React.useEffect(() => {
    if (isAuthorized) navigate(redirectPath, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, redirectPath]);

  return (
    <Container my={15} className={classes.mainContainer} size={"xs"}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        M2M Smart Machine
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate(routes.auth.register)}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius={"md"}>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            radius={"md"}
            withAsterisk={false}
            label="Email"
            placeholder="you@m2m.com"
            required
            id="email"
            name="email"
            size="sm"
            error={formik.touched.email && formik.errors.email}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <PasswordInput
            radius={"md"}
            withAsterisk={false}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            id="password"
            name="password"
            size="sm"
            error={formik.touched.password && formik.errors.password}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <Group position="apart" mt="lg">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
            <Anchor
              component="button"
              size="sm"
              onClick={() => navigate(routes.auth.forget_password)}
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button
            fullWidth
            radius={"md"}
            mt="xl"
            loading={isLoading}
            type="submit"
            loaderPosition="right"
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export { Login };

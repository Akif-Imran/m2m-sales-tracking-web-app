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
  Image,
  Center,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { routes } from "@routes";
import "./index.css";

const useStyles = createStyles(() => ({
  mainContainer: {
    position: "relative",
  },
}));

const Login: React.FC = () => {
  const { classes, theme } = useStyles();
  const [rememberMe, setRememberMe] = React.useState(true);
  const {
    login,
    state: { isLoading, isAuthorized },
  } = useAuthContext();
  const navigate = useNavigate();
  const redirectPath = routes.home;

  const validationSchema = yup.object().shape({
    email: yup.string().email("Must be valid email!").required("Email is required!"),
    password: yup.string().min(2, "Too short!").required("Password is required!"),
  });

  const form = useFormik({
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
  }, [isAuthorized]);

  const inputStyle = {
    label: {
      color: "white",
    },
  };

  return (
    <div className="bg">
      <Container my={15} className={classes.mainContainer} size={"xs"}>
        <Center>
          <Image src={"/icon.png"} height={120} width={200} fit="contain" />
        </Center>
        <Title
          align="center"
          color="white"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Sales Tracking
        </Title>
        <Text color="white" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor
            size="sm"
            component="button"
            onClick={() => navigate(routes.auth.register)}
            color={theme.primaryColor === "dark" ? "white" : theme.primaryColor}
          >
            Create account
          </Anchor>
        </Text>

        <Paper shadow="xl" p={30} bg={"transparent"}>
          <form onSubmit={form.handleSubmit}>
            <TextInput
              required
              withAsterisk={false}
              label="Email"
              placeholder="you@m2m.com"
              id="email"
              name="email"
              error={form.touched.email && form.errors.email}
              onChange={form.handleChange}
              value={form.values.email}
              styles={inputStyle}
            />
            <PasswordInput
              required
              withAsterisk={false}
              label="Password"
              placeholder="Your password"
              mt="md"
              id="password"
              name="password"
              error={form.touched.password && form.errors.password}
              onChange={form.handleChange}
              value={form.values.password}
              styles={inputStyle}
            />
            <Group position="apart" mt="lg">
              <Checkbox
                label="Keep me signed in"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                styles={inputStyle}
              />
              <Anchor
                component="button"
                size="sm"
                onClick={() => navigate(routes.auth.forget_password)}
                color={theme.primaryColor === "dark" ? "white" : theme.primaryColor}
              >
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" loading={isLoading} type="submit" loaderPosition="right">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export { Login };

import React from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
  Image,
  Box,
  rem,
} from "@mantine/core";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { routes } from "@routes";
import { IconArrowLeft } from "@tabler/icons-react";
import { colors } from "@theme";
import * as yup from "yup";
import "./index.css";
import { createAccount } from "@services";
import { notify } from "@utility";

interface IForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().min(3).max(60).required("Name is required!"),
  email: yup.string().email("Must be valid email!").required("Email is required!"),
  password: yup.string().min(2, "Too short!").required("Password is required!"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required!")
    .oneOf([yup.ref("password")], "Passwords must match!"),
});

const OTPSchema = yup.object().shape({
  otp: yup.string().length(4, "Invalid OTP").required("OTP is required!"),
});

const Register: React.FC = () => {
  const { classes, theme } = useStyles();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [_rememberMe, _setRememberMe] = React.useState(true);
  const [showRegister, _setShowRegister] = React.useState(true);
  const [_requestId, _setRequestId] = React.useState("");
  const navigate = useNavigate();
  // const location = useLocation();
  // const redirectPath = routes.dashboard.home;

  const form = useFormik<IForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values, _helpers) => {
      console.log("onSubmit for login", values);
      setIsRegistering((_prev) => true);
      createAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      })
        .then((res) => {
          notify("Register", res?.message, res?.success ? "success" : "error");
          if (res.success) {
            navigate(routes.auth.login);
          }
        })
        .catch((err) => {
          console.log("Register: ", err?.message);
          notify("Register", "Something went wrong!", "error");
        })
        .finally(() => {
          setIsRegistering((_prev) => false);
        });
      // setShowRegister((_prev) => false);
    },
    validationSchema: registerSchema,
  });

  const otp_form = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: (values, _helpers) => {
      console.log(values);
      navigate(routes.auth.login);
    },
    validationSchema: OTPSchema,
  });

  // React.useEffect(() => {
  //   if (isAuthorized) navigate(redirectPath, { replace: true });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthorized]);

  const inputStyle = {
    label: {
      color: "white",
    },
  };

  return (
    <div className="bg">
      {showRegister ? (
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
            Fill out the fields below to create an account.{" "}
            <Anchor
              size="sm"
              component="button"
              onClick={() => navigate(routes.auth.login)}
              color={theme.primaryColor === "dark" ? "white" : theme.primaryColor}
            >
              Already a member?
            </Anchor>
          </Text>

          <Paper shadow="xl" p={30} bg={"transparent"}>
            <form onSubmit={form.handleSubmit}>
              <TextInput
                required
                withAsterisk={false}
                label="Name"
                placeholder="John Doe"
                id="name"
                name="name"
                onChange={form.handleChange}
                value={form.values.name}
                styles={inputStyle}
                error={form.touched.name && form.errors.name ? `${form.errors.name}` : null}
              />
              <TextInput
                required
                withAsterisk={false}
                label="Email"
                placeholder="you@m2m.com"
                id="email"
                name="email"
                onChange={form.handleChange}
                value={form.values.email}
                styles={inputStyle}
                error={form.touched.email && form.errors.email ? `${form.errors.email}` : null}
              />
              <PasswordInput
                required
                withAsterisk={false}
                label="Password"
                placeholder="Your password"
                id="password"
                name="password"
                onChange={form.handleChange}
                value={form.values.password}
                styles={inputStyle}
                error={
                  form.touched.password && form.errors.password ? `${form.errors.password}` : null
                }
              />
              <PasswordInput
                required
                withAsterisk={false}
                label="Confirm Password"
                placeholder="Your password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={form.handleChange}
                value={form.values.confirmPassword}
                styles={inputStyle}
                error={
                  form.touched.confirmPassword && form.errors.confirmPassword
                    ? `${form.errors.confirmPassword}`
                    : null
                }
              />
              <Button
                fullWidth
                mt="xl"
                loading={isRegistering}
                loaderPosition="right"
                onClick={() => form.handleSubmit()}
              >
                Register
              </Button>
            </form>
          </Paper>
        </Container>
      ) : (
        <Container size={460} my={30}>
          <Title className={classes.title} align="center" color={colors.white}>
            Verify OTP
          </Title>
          <Text fz="sm" ta="center" color={colors.white}>
            Enter OTP sent to your email.
          </Text>

          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <TextInput
              required
              withAsterisk={false}
              label="Enter OTP"
              name="otp"
              id="otp"
              value={otp_form.values.otp}
              onChange={otp_form.handleChange("otp")}
              onBlur={otp_form.handleBlur("otp")}
              error={otp_form.touched.otp && otp_form.errors.otp ? `${otp_form.errors.otp}` : null}
              placeholder="XXXX"
            />
            <Group position="apart" mt="lg" className={classes.controls}>
              <Anchor
                color="dimmed"
                size="sm"
                className={classes.control}
                component="button"
                onClick={() => navigate(routes.auth.login)}
              >
                <Center inline>
                  <IconArrowLeft size={rem(12)} stroke={1.5} />
                  <Box ml={5}>Back to the login page</Box>
                </Center>
              </Anchor>
              <Button className={classes.control} onClick={() => otp_form.handleSubmit()}>
                Verify
              </Button>
            </Group>
          </Paper>
        </Container>
      )}
    </div>
  );
};

export { Register };

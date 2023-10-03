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
import { useAuthContext } from "@contexts";
import { routes } from "@routes";
import { IconArrowLeft } from "@tabler/icons-react";
import { colors } from "@theme";
import * as yup from "yup";
import "./index.css";

interface IForm {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema: yup.ObjectSchema<IForm> = yup.object().shape({
  companyName: yup.string().min(3).max(60).required("Company name is required!"),
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
  const [_rememberMe, _setRememberMe] = React.useState(true);
  const [showRegister, setShowRegister] = React.useState(true);
  const [_requestId, _setRequestId] = React.useState("");
  const {
    // login,
    state: { isLoading, isAuthorized },
  } = useAuthContext();
  const navigate = useNavigate();
  // const location = useLocation();
  const redirectPath = routes.dashboard.home;

  const form = useFormik<IForm>({
    initialValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values, _helpers) => {
      console.log("onSubmit for login", values);
      // navigate(routes.auth.verify_otp);
      setShowRegister((_prev) => false);
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
                label="Company Name"
                placeholder="John Doe"
                id="companyName"
                name="companyName"
                error={form.touched.companyName && form.errors.companyName}
                onChange={form.handleChange}
                value={form.values.companyName}
                styles={inputStyle}
              />
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
                id="password"
                name="password"
                error={form.touched.password && form.errors.password}
                onChange={form.handleChange}
                value={form.values.password}
                styles={inputStyle}
              />
              <PasswordInput
                required
                withAsterisk={false}
                label="Confirm Password"
                placeholder="Your password"
                id="confirmPassword"
                name="confirmPassword"
                error={form.touched.confirmPassword && form.errors.confirmPassword}
                onChange={form.handleChange}
                value={form.values.confirmPassword}
                styles={inputStyle}
              />
              <Button
                fullWidth
                mt="xl"
                loading={isLoading}
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
              <Button
                className={classes.control}
                onClick={() => otp_form.handleSubmit()}
              >
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

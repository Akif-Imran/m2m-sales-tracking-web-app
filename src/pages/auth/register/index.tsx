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
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAuthContext } from "@contexts";
import { routes } from "@routes";
// import { createCompany, verifyOTP } from "../../../services/user";
import "./index.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { colors } from "../../../theme";
import { useStyles } from "./styles";

interface IForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const RegisterSchema: yup.ObjectSchema<IForm> = yup.object().shape({
  name: yup.string().min(3).max(60).required("Name is required!"),
  email: yup.string().email("Must be valid email!").required("Email is required!"),
  phone: yup.string().required("Phone is required!"),
  password: yup.string().min(2, "Too short!").required("Password is required!"),
});

const OTPSchema = yup.object().shape({
  otp: yup.string().length(4, "Invalid OTP").required("OTP is required!"),
});

const Register: React.FC = () => {
  const { classes, theme } = useStyles();
  const [_rememberMe, _setRememberMe] = React.useState(true);
  const [isRegistering, _setIsRegistering] = React.useState(true);
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
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    onSubmit: (values, _helpers) => {
      console.log("onSubmit for login", values);
    },
    validationSchema: RegisterSchema,
  });

  const otp_form = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: (_values, _helpers) => {},
    validationSchema: OTPSchema,
  });

  React.useEffect(() => {
    if (isAuthorized) navigate(redirectPath, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized]);

  return (
    <div className="bg">
      {isRegistering ? (
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

          <Paper shadow="md" p={30} radius={"md"} bg={"transparent"}>
            <form onSubmit={form.handleSubmit}>
              <TextInput
                radius={"md"}
                withAsterisk={false}
                label="Name"
                placeholder="John Doe"
                required
                id="name"
                name="name"
                size="sm"
                error={form.touched.name && form.errors.name}
                onChange={form.handleChange}
                value={form.values.name}
                styles={{
                  label: {
                    color: "white",
                  },
                }}
              />
              <TextInput
                radius={"md"}
                withAsterisk={false}
                label="Email"
                placeholder="you@m2m.com"
                required
                id="email"
                name="email"
                size="sm"
                error={form.touched.email && form.errors.email}
                onChange={form.handleChange}
                value={form.values.email}
                styles={{
                  label: {
                    color: "white",
                  },
                }}
              />
              <TextInput
                radius={"md"}
                withAsterisk={false}
                label="Phone No."
                placeholder="+60 123 4567890"
                required
                id="phone"
                name="phone"
                size="sm"
                error={form.touched.phone && form.errors.phone}
                onChange={form.handleChange}
                value={form.values.phone}
                styles={{
                  label: {
                    color: "white",
                  },
                }}
              />
              <PasswordInput
                radius={"md"}
                withAsterisk={false}
                label="Password"
                placeholder="Your password"
                required
                id="password"
                name="password"
                size="sm"
                error={form.touched.password && form.errors.password}
                onChange={form.handleChange}
                value={form.values.password}
                styles={{
                  label: {
                    color: "white",
                  },
                }}
              />
              <Button
                radius={"md"}
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
              withAsterisk={false}
              radius={"md"}
              label="Enter OTP"
              name="otp"
              id="otp"
              value={otp_form.values.otp}
              onChange={otp_form.handleChange("otp")}
              onBlur={otp_form.handleBlur("otp")}
              error={otp_form.touched.otp && otp_form.errors.otp ? `${otp_form.errors.otp}` : null}
              placeholder="XXXX"
              required
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
                radius={"md"}
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

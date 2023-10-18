import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { routes } from "@routes";
import { useNavigate } from "react-router-dom";
import { colors } from "@theme";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const _VerifyOTP: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center" color={colors.titleText}>
        Verify OTP
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter OTP sent to your email.
      </Text>

      <Paper withBorder shadow="xl" p={30} mt="xl">
        <TextInput label="Enter OTP" placeholder="XXXX" required />
        <Group position="apart" mt="lg" className={classes.controls}>
          <Anchor
            color="dimmed"
            className={classes.control}
            component="button"
            onClick={() => navigate(routes.auth.login)}
          >
            <Center inline>
              <IconArrowLeft size={rem(12)} stroke={1.5} />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button className={classes.control}>Verify</Button>
        </Group>
      </Paper>
    </Container>
  );
};

export { _VerifyOTP };

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

const ForgotPassword: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput radius={"md"} label="Your email" placeholder="me@mantine.dev" required />
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
          <Button radius={"md"} className={classes.control}>
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};
export  {ForgotPassword};

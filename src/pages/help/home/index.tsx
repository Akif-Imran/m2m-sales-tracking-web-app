import React from "react";
import { useStyles } from "./styles";
import { Card, Container, Grid, Image, Stack, Text, Title, rem } from "@mantine/core";
import { colors } from "@theme";
import styles from "./help.module.css";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

interface OwnProps {}

const _Help: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  return (
    // <Card radius={"md"} shadow="md">
    <div>
      <div className={styles.bg}>
        <Text color="white">Contact Us</Text>
        <Container my={rem(15)} className={classes.mainContainer} size={"xs"}>
          <div className={classes.imageTextContainer}>
            <Image src={"/icon.png"} height={120} width={200} fit="contain" />
            <Title color="white" fw={"bold"} ff={`Greycliff CF, ${theme.fontFamily}`}>
              Contact Us
            </Title>
            <Text color="white" align="center">
              Want to get in touch? We'd love to hear from you. Here's how you can reach us.
            </Text>
          </div>
        </Container>
      </div>
      <Grid mt={-100} mx={"xl"}>
        <Grid.Col xs={12} md={6}>
          <Card radius={"md"} shadow="md" w={"100%"} h={rem(280)}>
            <Stack align="center">
              <BsFillTelephoneFill color={theme.colors[theme.primaryColor][6]} size={75} />
              <Text fz={"xl"} fw={"bold"} color={theme.primaryColor}>
                Let's Speak
              </Text>
              <Text color={colors.titleText}>
                Need Help? Just pick up the phone to chat with a member of our team.
              </Text>
              <Text fw={"bold"} fz={"xl"} mt={"md"} color={colors.titleText}>
                +60 196 638982
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Card radius={"md"} shadow="md" w={"100%"} h={rem(280)}>
            <Stack align="center">
              <MdEmail color={theme.colors[theme.primaryColor][6]} size={75} />
              <Text fz={"xl"} fw={"bold"} color={theme.primaryColor}>
                Email Us
              </Text>
              <Text color={colors.titleText}>
                You can reach out to by emailing us. We'll be sure to get back to you soon.
              </Text>
              <Text fw={"bold"} fz={"xl"} mt={"md"} color={colors.titleText}>
                support@m2m-network.com
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
    // </Card>
  );
};

export { _Help };

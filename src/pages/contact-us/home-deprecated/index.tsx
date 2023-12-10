import React from "react";
import { useStyles } from "./styles";
import { Card, Container, Flex, Image, Stack, Text, Title, rem } from "@mantine/core";
import { colors } from "../../../theme";

interface OwnProps {}

const _About: React.FC<OwnProps> = () => {
  const { classes, theme } = useStyles();
  return (
    // <Card radius={"md"} shadow="md">
    <div>
      <div className={classes.bg}>
        {/* <Text color="white">Contact Us</Text> */}
        <Container my={rem(15)} className={classes.mainContainer} size={"xs"}>
          <div className={classes.imageTextContainer}>
            <Image src={"/icon.png"} height={120} width={200} fit="contain" />
            <Title color="white" fw={"bold"} ff={`Greycliff CF, ${theme.fontFamily}`}>
              Networks
            </Title>
            {/* <Text color="white" align="center">
              Want to get in touch? We'd love to hear from you. Here's how you
              can reach us.
            </Text> */}
          </div>
        </Container>
      </div>
      <Flex direction={"row"} gap={"md"} px={"md"} justify={"center"} mt={-150}>
        <Card radius={"md"} shadow="md" maw={rem(800)} mx={"xl"} px={"lg"}>
          <Stack align="center">
            <Text fz={"xl"} fw={"bold"} color={theme.primaryColor}>
              About Us
            </Text>
            <Text color={colors.titleText} align="center">
              M2M Networks is a company that specializes in providing customized solutions that
              positively impacted the business, versus solutions that were technically excellent but
              may not have delivered on key business objectives. Our investments on into product
              development some of the major holistic pain point related to software development and
              maintenance, keep us on the cutting edge of technology and well positioned to deliver
              exponential value to our client.
            </Text>
            {/* <Text fw={"bold"} fz={"xl"} mt={"md"} color={colors.titleText}>
              +60 196 638982
            </Text> */}
          </Stack>
        </Card>
        {/* <Card radius={"md"} shadow="md" w={"100%"}>
          <Stack align="center">
            <MdEmail color={colors.primary} size={75} />
            <Text fz={"xl"} fw={"bold"} color={colors.primary}>
              Email Us
            </Text>
            <Text color={colors.titleText}>
              You can reach out to by emailing us. We'll be sure to get back to
              you soon.
            </Text>
            <Text fw={"bold"} fz={"xl"} mt={"md"} color={colors.titleText}>
              support@m2m-network.com
            </Text>
          </Stack>
        </Card> */}
      </Flex>
    </div>
    // </Card>
  );
};
export { _About };

import React from "react";
import { useStyles } from "./styles";
import { Anchor, Avatar, Badge, Card, Flex, Text, rem } from "@mantine/core";
import { colors } from "@theme";
import { userStatusColors } from "@constants";

interface OwnProps {
  item: IUser;
  onClick?: () => void;
}

const _UserCard: React.FC<OwnProps> = ({ item, onClick }) => {
  const { classes } = useStyles();

  const noImageStyle = {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      filter: `invert(33%) sepia(65%) saturate(0%) hue-rotate(253deg) brightness(98%) contrast(88%)`,
      objectFit: "contain",
      width: rem(64),
      height: rem(64),
    },
  };

  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"sm"} radius={"md"} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <Avatar
            src={item?.avatar ? `${item?.avatar}` : "/user.png"}
            radius={item?.avatar ? rem(250) : rem(250)}
            size={"xl"}
            //@ts-expect-error style works
            styles={item?.avatar ? undefined : noImageStyle}
          />
          <Badge variant="filled" color={userStatusColors[item.userTypeId]}>
            {item.userTypeName}
          </Badge>
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.minorDetailsWithCount}>
            <div className={classes.textWithIconButton}>
              <Flex direction={"row"} align={"center"} justify={"space-between"}>
                <Text fw={"bold"} fs={"normal"} fz={"md"} color={colors.titleText}>
                  {item?.firstName} {item?.lastName}
                </Text>
              </Flex>
            </div>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.phone || "N/A"}
            </Text>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.designation || "N/A"}
            </Text>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.departmentName || "N/A"}
            </Text>
            <Anchor href={`mailto:${item?.email}`} underline={true} target="_blank" c={"blue"}>
              {item?.email || "N/A"}
            </Anchor>
            {/* <Anchor href={item?.website} underline={true} target="_blank" c={"blue"}>
              {item?.website || "N/A"}
            </Anchor> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export { _UserCard };

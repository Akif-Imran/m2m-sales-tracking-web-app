import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Avatar, Card, Flex, Text, UnstyledButton, rem } from "@mantine/core";
import {
  IconCalendarPlus,
  IconCash,
  IconFiles,
  IconInfoSquareRounded,
  IconUserPlus,
} from "@tabler/icons-react";
import { colors } from "@theme";
import { useNavigate } from "react-router-dom";
import { routes } from "@routes";

interface OwnProps {
  onClick: () => void;
  item: ICompany;
  openContact: () => void;
  openFollowUp: () => void;
  openExpense: () => void;
}

const _CompanyCard: React.FC<OwnProps> = ({
  onClick,
  item,
  openContact,
  openFollowUp,
  openExpense,
}) => {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    // toggleLayout();
    navigate(route);
    // setScrollIndex(index);
  };

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
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <Avatar
            src={item?.logo ? `${item?.logo}` : "/car.png"}
            radius={item?.logo ? rem(250) : rem(250)}
            size={"xl"}
            //@ts-expect-error style work
            styles={item?.logo ? undefined : noImageStyle}
          />
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.minorDetailsWithCount}>
            <Flex direction={"row"} align={"center"} justify={"space-between"}>
              <Text fw={"bold"} fs={"normal"} fz={"md"} color={colors.titleText}>
                {item?.name}
              </Text>
              <ActionIcon
                variant="transparent"
                onClick={(event) => {
                  event.stopPropagation();
                  // props?.toggleLayout();
                  // setScrollIndex(index);
                  // navigate(routes.vehicles.details_nav(item.id.toString()));
                }}
              >
                <IconInfoSquareRounded size={22} stroke={1.3} color={colors.titleText} />
              </ActionIcon>
            </Flex>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.phone || "N/A"}
            </Text>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.email || "N/A"}
            </Text>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.website || "N/A"}
            </Text>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.city || "N/A"} {item?.state || "N/A"} {item.country || "N/A"}
            </Text>
          </div>
        </div>
      </div>

      <div className={classes.labelButtonsContainer}>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openContact();
          }}
        >
          <IconUserPlus stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Contact
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openFollowUp();
          }}
        >
          <IconCalendarPlus stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Follow Up
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.rightAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openExpense();
          }}
        >
          <IconCash stroke={1.3} size={22} color={colors.titleText} />
          <Text
            fw={"normal"}
            fs={"normal"}
            fz={"sm"}
            ml={rem(4)}
            mr={"xs"}
            className={classes.labelButton}
          >
            Expense
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate(routes.reports.list_nav(item.id.toString()));
          }}
        >
          <IconFiles stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Reports
          </Text>
        </UnstyledButton>
      </div>
    </Card>
  );
};

export { _CompanyCard };

import { createStyles, rem } from "@mantine/core";
import { colors } from "@theme";

export const noImageStyle = {
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

export const menuIconStyle = {
  stroke: 1.3,
  size: 16,
  color: colors.titleText,
};

export const titleTextStyle = {
  fw: 700,
  c: colors.titleText,
  size: "sm",
};

export const bodyTextStyle = {
  fz: "sm",
  color: colors.titleText,
};

export const cardConfig = {
  shadow: "sm",
  mb: "xs",
  px: "sm",
  py: "sm",
  radius: "md",
  mih: rem(180),
};

export const useGStyles = createStyles((_theme) => ({
  fileUploadButton: {
    marginTop: rem(-32),
    marginLeft: rem(128),
  },
  searchContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    // border: "1px solid",
  },
  searchInput: {
    marginLeft: rem(2),
    flexGrow: 1,
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    rowGap: rem(6),
  },
  radioContainerRow: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    flexWrap: "wrap",
    columnGap: rem(6),
    rowGap: rem(6),
  },
}));

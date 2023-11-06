import { createStyles, rem } from "@mantine/core";
import { colors } from "@theme";

export const menuIconStyle = {
  stroke: 1.3,
  size: 16,
  color: colors.titleText,
};

export const useGStyles = createStyles({
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
});

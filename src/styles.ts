import { createStyles, rem } from "@mantine/core";

export const useGStyles = createStyles({
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
});

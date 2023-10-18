import { createStyles, rem } from "@mantine/core";
import { colors } from "@theme";

export const useStyles = createStyles((theme) => ({
    descText: {
        flex: 1,
        textAlign: "right",
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: colors.titleText,
        fontWeight: 400,
        fontSize: rem(14),
        lineHeight: 1,
        // border: "1px solid gray",
      },
      headerText: {
        flex: 1,
        textAlign: "left",
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: colors.titleText,
        fontWeight: 700,
        fontSize: rem(14),
        lineHeight: 1,
        // border: "1px solid gray",
      },
}));

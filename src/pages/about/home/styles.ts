import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  mainContainer: {
    position: "relative",
  },
  bg: {
    position: "relative",
    height: "50vh",
    borderRadius: "8px",
    overflowY: "hidden",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      background:
        'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),url("/about-us-2.jpeg")',
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },
  imageTextContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    // border: "1px solid white",
  },
}));

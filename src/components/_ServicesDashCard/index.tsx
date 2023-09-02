import {
  createStyles,
  Text,
  Card,
  RingProgress,
  Group,
  rem,
} from "@mantine/core";
import { colors } from "../../theme";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  count: {
    display: "flex",
    flexDirection: "row",
  },
  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: colors.titleText,
    fontWeight: 600,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: colors.titleText,
    fontWeight: 600,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: "flex",
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  ring: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",

    [theme.fn.smallerThan("xs")]: {
      justifyContent: "center",
      marginTop: theme.spacing.md,
    },
  },
}));

interface OwnProps {
  data: {
    title: string;
    completed: number;
    total: number;
    stats: {
      value: number;
      label: string;
    }[];
  };
}

export const _ServicesDashCard: React.FC<OwnProps> = ({ data }) => {
  const { title, completed, total, stats } = data;
  const { classes, theme } = useStyles();
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" shadow="sm" className={classes.card} my={4}>
      <div className={classes.inner}>
        <div>
          <Text fz="xl" className={classes.label}>
            {title}
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {total}
            </Text>
            <Text fz="xs" color="dimmed">
              Total
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[
              { value: (completed / total) * 100, color: theme.primaryColor },
            ]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {((completed / total) * 100).toFixed(0)}%
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  Completed
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
};

export const dummyData = {
  title: "Services",
  completed: 4,
  total: 27,
  stats: [
    {
      value: 4,
      label: "Completed",
    },
    {
      value: 2,
      label: "Pending",
    },
    {
      value: 0,
      label: "In progress",
    },
  ],
};

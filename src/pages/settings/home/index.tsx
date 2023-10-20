import React from "react";
import { useStyles } from "./styles";
import { Grid, ScrollArea } from "@mantine/core";
import { _SettingsCard } from "../components";
import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "@routes";

interface OwnProps {}

const Settings: React.FC<OwnProps> = () => {
  useStyles();
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(routes.settings.change_password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid>
      <Grid.Col sm={12} md={5}>
        <ScrollArea type="scroll" h={{ md: "98vh" }}>
          <_SettingsCard
            title="Change Password"
            onClick={() => navigate(routes.settings.change_password)}
          />
          <_SettingsCard title="App Theme" onClick={() => navigate(routes.settings.app_theme)} />
          <_SettingsCard
            title="Expense Type"
            onClick={() => navigate(routes.settings.expense_type)}
          />
          <_SettingsCard title="Suppliers" onClick={() => navigate(routes.settings.suppliers)} />
        </ScrollArea>
      </Grid.Col>
      <Grid.Col sm={12} md={7}>
        <ScrollArea h={{ md: "98vh" }} type="scroll">
          <Outlet />
        </ScrollArea>
      </Grid.Col>
    </Grid>
  );
};

export { Settings };

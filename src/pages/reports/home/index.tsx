import React from "react";
import { ActionIcon, Grid, ScrollArea, Stack, rem } from "@mantine/core";
import { colors } from "../../../theme";
import { routes } from "@routes";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Error404 } from "@pages";
import { IconArrowLeft } from "@tabler/icons-react";
import { _ReportCard } from "../components";

interface OwnProps {}

const Reports: React.FC<OwnProps> = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!companyId) return;
    navigate(routes.reports.companies_report_nav(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  if (!companyId) {
    return <Error404 />;
  } else {
    return (
      <Grid>
        <Grid.Col sm={12} md={4}>
          <ScrollArea h={"92vh"} type="scroll">
            <Stack spacing={rem(8)} mt={rem(8)}>
              <ActionIcon variant="subtle" onClick={() => navigate(routes.company.list)}>
                <IconArrowLeft size="1rem" color={colors.titleText} />
              </ActionIcon>
              {/* <_SelectedVehicleInfoCard item={vehicle} onClick={() => {}} /> */}
              <_ReportCard
                title="Companies Report"
                onClick={() => {
                  navigate(routes.reports.companies_report_nav(companyId));
                }}
              />
              <_ReportCard
                title="Claims Report"
                onClick={() => navigate(routes.reports.claims_report_nav(companyId))}
              />
              <_ReportCard
                title="Task Report"
                onClick={() => {
                  navigate(routes.reports.task_report_nav(companyId));
                }}
              />
              <_ReportCard
                title="Project Performance Report"
                onClick={() => {
                  navigate(routes.reports.project_performance_report_nav(companyId));
                }}
              />
              <_ReportCard
                title="Team Performance Report"
                onClick={() => {
                  navigate(routes.reports.team_performance_report_nav(companyId));
                }}
              />
              <_ReportCard
                title="Leaves Report"
                onClick={() => {
                  navigate(routes.reports.leaves_report_nav(companyId));
                }}
              />
              <_ReportCard
                title="Purchase Request Report"
                onClick={() => {
                  navigate(routes.reports.purchase_request_report_nav(companyId));
                }}
              />
            </Stack>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col sm={12} md={8}>
          <ScrollArea h={"94vh"} type="scroll">
            <Outlet />
          </ScrollArea>
        </Grid.Col>
      </Grid>
    );
  }
};

export default Reports;

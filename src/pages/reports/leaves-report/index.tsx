import React from "react";
import { useStyles } from "./styles";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { IconCalendar, IconFileExport } from "@tabler/icons-react";
import { colors } from "../../../theme";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { notify } from "../../../utils/notifications";
import { useAuthContext } from "@contexts";
//@ts-expect-error types missing
import html2pdf from "html2pdf.js";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";

interface OwnProps {}

const LeavesReport: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, _setRecords] = React.useState<ILeaveApplication[]>([]);
  const { companyId } = useParams();
  const [isLoading, _setIsLoading] = React.useState<boolean>(false);

  const handleSearch = () => {
    if (!companyId) {
      notify("Error", "Invalid vehicle Id", "error");
      return;
    }
    fetchUtilizationReport(startDate, endDate, companyId);
  };

  const fetchUtilizationReport = React.useCallback(
    (start: Date, end: Date, id: string) => {
      // setIsLoading(true);
      console.log(start, end, id, token);
      // getUtilizationReport(token, {
      //   startDate: DateTime.fromJSDate(start).toFormat("yyyy-MM-dd"),
      //   endDate: DateTime.fromJSDate(end).toFormat("yyyy-MM-dd"),
      //   vehicleId: id,
      // })
      //   .then((res) => {
      //     if (res.success) {
      //       setRecords(res.result);
      //     }
      //   })
      //   .catch(() => {
      //     notify("Error", "Something went wrong", "error");
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
    },
    [token]
  );

  React.useEffect(() => {
    if (!companyId) return;
    fetchUtilizationReport(startDate, endDate, companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUtilizationReport, companyId]);

  const handleChangeStartDate = (value: DateValue) => {
    if (!value) return;
    setStartDate(value);
  };

  const handleChangeEndDate = (value: DateValue) => {
    if (!value) return;
    setEndDate(value);
  };

  const handleExportPDF = async () => {
    const stDate = startDate ? startDate : new Date();
    const enDate = endDate ? endDate : new Date();
    if (records.length === 0) {
      notify("Export PDF", "No data to export", "error");
      return;
    }
    notify("Export PDF", "Please wait...", "success");
    console.log(stDate, enDate);
    return;
    // const html = getUtilizationReportHTML(
    //   "Fleet Utilization Report",
    //   records,
    //   vehicle?.reg_no || "N/A",
    //   vehicle?.fuel_type_name || "N/A",
    //   vehicle?.serial_number || "N/A",
    //   user?.email || "N/A",
    //   DATE_FORMAT_YYYY_MM_DD(stDate),
    //   DATE_FORMAT_YYYY_MM_DD(enDate)
    // );
    // const element = document.createElement("prod-report");
    // element.innerHTML = html;
    // const opt = {
    //   margin: 0.2,
    //   filename: `Forklift-Utilization-Report-${stDate.getFullYear()}-${
    //     stDate.getMonth() + 1
    //   }-${stDate.getDate()}.pdf`,
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    // };
    // html2pdf().set(opt).from(element).toPdf().save();
  };

  const rows =
    records.length === 0 ? (
      <tr>
        <td colSpan={5}>
          <Center>
            <Text color={colors.titleText}>No data to display</Text>
          </Center>
        </td>
      </tr>
    ) : (
      <>
        {records.map((item, index) => {
          const start = DateTime.fromISO(item.startDate);
          const end = DateTime.fromISO(item.endDate);
          return (
            <tr key={index}>
              <td>{item?.name}</td>
              <td>{start.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
              <td>{end.toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
              <td>{end.diff(start).toFormat("hh:mm:ss")}</td>
              <td>{item.typeName}</td>
              <td>{item.statusName}</td>
              <td>{item.reason}</td>
              <td>{item.remarks}</td>
            </tr>
          );
        })}
      </>
    );

  return (
    <Stack spacing={rem(5)}>
      <Text fz={rem(25)} color={colors.titleText}>
        Leaves Report
      </Text>
      <Card radius={"md"} shadow="md" sx={{ minHeight: "94vh" }}>
        <div className={classes.controlsContainer}>
          <Group>
            <DatePickerInput
              radius={"md"}
              label="Start Date"
              placeholder="Pick Date"
              value={startDate}
              onChange={handleChangeStartDate}
              required
              withAsterisk={false}
              icon={<IconCalendar size="1.2rem" stroke={1.5} color={colors.titleText} />}
              styles={{
                input: {
                  width: 200,
                },
              }}
            />
            <DatePickerInput
              radius={"md"}
              label="End Date"
              placeholder="Pick Date"
              value={endDate}
              onChange={handleChangeEndDate}
              required
              withAsterisk={false}
              icon={<IconCalendar size="1.2rem" stroke={1.5} color={colors.titleText} />}
              styles={{
                input: {
                  width: 200,
                },
              }}
            />
          </Group>
          <Group>
            <Button
              variant="filled"
              radius={"md"}
              leftIcon={<IconFileExport size="1.2rem" stroke={2} />}
              size="sm"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              variant="filled"
              radius={"md"}
              leftIcon={<IconFileExport size="1.2rem" stroke={2} />}
              size="sm"
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Group>
        </div>
        {isLoading ? (
          <Center mt={"xs"}>
            <Loader size={"lg"} variant="dots" />
          </Center>
        ) : (
          <ScrollArea>
            <Table sx={{ minWidth: "800px" }} verticalSpacing="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date/Time</th>
                  <th>End Date/Time</th>
                  <th>Duration (hh:mm:ss)</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </Stack>
  );
};

export default LeavesReport;

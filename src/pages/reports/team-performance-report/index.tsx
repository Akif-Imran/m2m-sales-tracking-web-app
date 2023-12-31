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

const TeamPerformanceReport: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [records, _setRecords] = React.useState<any[]>([]);
  const { vehicleId } = useParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSearch = () => {
    console.log("called search");
    if (!vehicleId) {
      notify("Error", "Invalid vehicle Id", "error");
      return;
    }
    fetchRecords(startDate, endDate, vehicleId);
  };

  const fetchRecords = React.useCallback(
    (start: Date, end: Date, id: string) => {
      setIsLoading(true);
      console.log(start, end, id, token);
      // getMaintenanceReport(token, {
      //   startDate: DateTime.fromJSDate(start).toFormat("yyyy-MM-dd"),
      //   endDate: DateTime.fromJSDate(end).toFormat("yyyy-MM-dd"),
      //   vehicleId: id,
      // })
      //   .then((res) => {
      //     if (res.success) {
      //       setRecords(res.result);
      //     }
      //   })
      //   .catch((_err) => {
      //     notify("Error", "Something went wrong", "error");
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
    },
    [token]
  );

  React.useEffect(() => {
    if (!vehicleId) {
      return;
    }
    fetchRecords(startDate, endDate, vehicleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRecords, vehicleId]);

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
    // const html = getMaintenanceReportHTML(
    //   "Fleet Maintenance Report",
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
    //   filename: `Fleet-Maintenance-Report-${stDate.getFullYear()}-${
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
          return (
            <tr key={index}>
              <td>{item?.name}</td>
              <td>{DateTime.fromISO(item.service_date).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
              <td>{item.type_name}</td>
              <td>{item.status_name}</td>
              <td>{item.description}</td>
            </tr>
          );
        })}
      </>
    );

  return (
    <Stack spacing={rem(5)}>
      <Text fz={rem(25)} color={colors.titleText}>
        Team Performance Report
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
              onClick={() => handleSearch()}
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
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
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

export default TeamPerformanceReport;

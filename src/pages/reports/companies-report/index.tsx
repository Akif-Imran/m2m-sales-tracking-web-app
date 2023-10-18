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
import { DATE_FORMAT_YYYY_MM_DD } from "@helpers";
import { notify } from "../../../utils/notifications";
//@ts-expect-error types missing
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";

interface OwnProps {}

const CompaniesReport: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, _setRecords] = React.useState<ICompany[]>([]);
  const { companyId } = useParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  console.log("companiesReport", companyId);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const fetchProductionReports = React.useCallback(
    (date?: Date) => {
      // setIsLoading(true);
      const dateString = date ? DATE_FORMAT_YYYY_MM_DD(date) : DATE_FORMAT_YYYY_MM_DD(startDate);
      console.log(dateString);
      // getProductionReportNew(token, dateString, dateString, deviceNo || "")
      //   .then((res) => {
      //     if (res.success) {
      //       console.log(res.body.length);
      //       setAlerts(res.body);
      //       const data = res.body;
      //       let tDur = 0,
      //         tPro = 0,
      //         tCycle = 0;
      //       for (let obj of data) {
      //         tDur += obj.duration;
      //         tPro += obj.production;
      //       }
      //       tCycle = tDur / tPro;
      //       console.log(tDur);
      //       setTotalDuration(tDur);
      //       setTotalProduction(tPro);
      //       setAvgCycleTime(tPro === 0 ? 0 : tCycle);
      //     }
      //   })
      //   .catch((err) => {
      //     notify("Alerts", "An error occurred.", "error");
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
    },
    [startDate]
  );

  React.useEffect(() => {
    fetchProductionReports();
  }, [fetchProductionReports]);

  const handleChangeStartDate = (value: DateValue) => {
    if (!value) return;
    setStartDate(value);
    fetchProductionReports(value);
  };

  const handleChangeEndDate = (value: DateValue) => {
    if (!value) return;
    setEndDate(value);
    fetchProductionReports(value);
  };

  const handleExportPDF = async () => {
    // const stDate = startDate ? startDate : new Date();
    // const enDate = endDate ? endDate : new Date();
    if (records.length === 0) {
      notify("Export PDF", "No data to export", "error");
      return;
    }
    notify("Export PDF", "Please wait...", "success");
    return;
    // const html = getCollisionReportHTML(
    //   "Collision Report",
    //   records,
    //   "PT-01",
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
    //   filename: `Companies-Report-${stDate.getFullYear()}-${
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
        {records.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{item.email}</td>
            <td>{item.city}</td>
            <td>{item.state}</td>
            <td>{item.country}</td>
            {/* <td>{item.driver_name}</td> */}
          </tr>
        ))}
      </>
    );

  return (
    <Stack spacing={rem(5)}>
      <Text fz={rem(25)} color={colors.titleText}>
        Companies Report
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
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
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

export default CompaniesReport;

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
import { notify } from "../../../utils/notifications";
import { useAuthContext } from "@contexts";
//@ts-expect-error types missing
import html2pdf from "html2pdf.js";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { useParams } from "react-router-dom";

interface OwnProps {}

const PurchaseRequestReport: React.FC<OwnProps> = () => {
  const { classes } = useStyles();
  const {
    state: { token },
  } = useAuthContext();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [records, _setRecords] = React.useState<IPurchaseRequest[]>([]);
  const { companyId } = useParams();
  const [isLoading, _setIsLoading] = React.useState<boolean>(false);

  const handleSearch = () => {
    fetchRecords(startDate, endDate, companyId || "na");
  };

  const fetchRecords = React.useCallback(
    (startDate: Date, endDate: Date, id: string) => {
      // setIsLoading(true);
      console.log(startDate, endDate, id, token);
      // const startDateString = startDate
      //   ? DATE_FORMAT_YYYY_MM_DD(startDate)
      //   : DATE_FORMAT_YYYY_MM_DD(date);
      // const endDateString = endDate
      //   ? DATE_FORMAT_YYYY_MM_DD(endDate)
      //   : DATE_FORMAT_YYYY_MM_DD(date);
      // console.log(startDateString);

      // getHistoryReport(token, {
      //   IMEI: id,
      //   startDate: startDateString,
      //   endDate: endDateString,
      // })
      //   .then((res) => {
      //     if (res.success) {
      //       setRecords(res.result);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err?.message);
      //     notify("History Report", "An error occurred", "error");
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
    },
    [token]
  );

  React.useEffect(() => {
    if (!companyId) {
      return;
    }
    fetchRecords(startDate, endDate, companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRecords, companyId]);

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
    // const html = getHistoryReportHTML(
    //   "History Report",
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
    //   filename: `History-Report-${stDate.getFullYear()}-${
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
            <td>{item.itemName}</td>
            <td>{item.status}</td>
            <td>{item.itemType}</td>
            <td>{item.quantity}</td>
            <td>{DateTime.fromISO(item.warranty).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
            <td>{item.price.amount}</td>
            <td>{item.remarks}</td>
          </tr>
        ))}
      </>
    );

  return (
    <Stack spacing={rem(5)}>
      <Text fz={rem(25)} color={colors.titleText}>
        Purchase Request Report
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
                  <th>Status</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Date/Time</th>
                  <th>Price</th>
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

export default PurchaseRequestReport;

// import React from "react";
// import { useStyles } from "./styles";
// import {
//   VictoryArea,
//   VictoryChart,
//   VictoryLine,
//   VictoryVoronoiContainer,
//   createContainer,
//   VictoryZoomContainerProps,
//   VictoryVoronoiContainerProps,
//   VictoryAxis,
//   VictoryLabel,
//   VictoryTheme,
//   VictoryTooltip,
//   VictoryBar,
// } from "victory";
// import { getProductionReportNew, getProductionSummary } from "../../../services/reports";
// import { useUserContext } from "../../../hooks";
// import { DateTime } from "luxon";
// import { colors } from "../../../theme";
// import { chartsDivIds } from "../../../api/constants";

// interface OwnProps {
//   deviceNo: string;
// }
// const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

// export const _VictoryVoronaiContainer: React.FC<OwnProps> = ({ deviceNo }) => {
//   const { classes, cx, theme } = useStyles();
//   const { token } = useUserContext();
//   const [lineData, setLineData] = React.useState<any[]>([]);
//   const [dates, setDates] = React.useState<string[]>([]);

//   const getDatesBetween = (start: string, end: string) => {
//     const startDate = DateTime.fromISO(start);
//     const endDate = DateTime.fromISO(end);

//     const dates = [];

//     let currentDate = startDate;
//     while (currentDate <= endDate) {
//       dates.push(currentDate.toFormat("yyyy-MM-dd"));
//       currentDate = currentDate.plus({ days: 1 });
//     }

//     return dates;
//   };

//   function drawBarChart() {
//     // Some raw data (not necessarily accurate)
//     document.getElementById(chartsDivIds.real_time_dash_last_7_days)!.innerHTML = "";
//     const rows: [string, number][] = [];
//     lineData.forEach((value) => {
//       rows.push([value.x, value.y]);
//     });
//     const data = google.visualization.arrayToDataTable([["Date", "Production"], ...rows]);
//     // var view = new google.visualization.DataView(data);
//     // view.setColumns([
//     //   0,
//     //   1,
//     //   {
//     //     calc: "stringify",
//     //     sourceColumn: 1,
//     //     type: "string",
//     //     role: "annotation",
//     //   },
//     // ]);

//     const chart = new google.visualization.ColumnChart(
//       //@ts-expect-error
//       document.getElementById(chartsDivIds.real_time_dash_last_7_days)
//     );
//     chart.clearChart();
//     chart.draw(data, {
//       // title: "L Production by Company Country",
//       // height: 300,
//       vAxis: {
//         title: "Production",
//         textStyle: {
//           fontSize: 12,
//           color: colors.titleText,
//         },
//       },
//       hAxis: {
//         title: "Date",
//         baselineColor: colors.titleText,

//         textStyle: {
//           fontSize: 12,
//           color: colors.titleText,
//         },
//       },
//       height: 140,
//       animation: {
//         duration: 1000,
//         easing: "out",
//         startup: true,
//       },
//       // seriesType: "bars",
//       series: { 5: { type: "bars" } },
//       chartArea: {
//         width: "100%",
//         height: "100%",
//         left: 50,
//         bottom: 20,
//         top: 10,
//       },
//       colors: [
//         theme.colors[theme.primaryColor][6],
//         theme.colors.blue[5],
//         theme.colors.red[5],
//         theme.colors.yellow[5],
//         theme.colors.green[5],
//         theme.colors.indigo[5],
//         theme.colors.violet[5],
//         theme.colors.grape[5],
//         theme.colors.teal[5],
//         theme.colors.cyan[5],
//       ],
//       titleTextStyle: {
//         color: colors.titleText,
//         fontSize: 18,
//       },
//       tooltip: {
//         textStyle: {
//           color: colors.titleText,
//           fontSize: 14,
//         },
//       },
//     });
//   }

//   React.useEffect(() => {
//     if (!token || !deviceNo) return;
//     const endDate = DateTime.now().toUTC().toFormat("yyyy-MM-dd");
//     const startDate = DateTime.now().toUTC().minus({ days: 7 }).toFormat("yyyy-MM-dd");

//     // console.log("victory chart", startDate, endDate);
//     const dts = getDatesBetween(startDate, endDate);
//     // console.log("dates between", dts);

//     getProductionSummary(token, startDate, endDate, deviceNo).then((res) => {
//       console.log("production summary", res);
//       const arr: { x: string; y: number }[] = [];
//       if (res.success) {
//         res.body.map((item) => {
//           arr.push({
//             y: item.production,
//             x: item._id,
//           });
//         });
//         console.log("arr", arr);
//         const sortedDates = arr.sort((a, b) => {
//           const dateA = DateTime.fromISO(a.x).toSeconds();
//           const dateB = DateTime.fromISO(b.x).toSeconds();
//           return dateA - dateB;
//         });
//         setLineData(arr);
//       }
//     });

//     setDates(dts);
//   }, [token, deviceNo]);

//   React.useEffect(() => {
//     if (!lineData) return;
//     if (lineData.length === 0) return;
//     drawBarChart();
//   }, [lineData]);

//   return (
//     <div
//       id={chartsDivIds.real_time_dash_last_7_days}
//       style={{
//         width: "100%",
//         flex: 1,
//         display: "flex",
//         // border: "1px solid black",
//       }}
//     ></div>
//     // <VictoryChart
//     //   theme={VictoryTheme.material}
//     //   domainPadding={8}
//     //   height={85}
//     //   minDomain={{ y: 0 }}
//     //   padding={{ bottom: 40, left: 50, right: 40, top: -25 }}
//     //   containerComponent={
//     //     <VictoryVoronoiContainer
//     //       responsive={true}
//     //       labels={({ datum }) =>
//     //         `Date: ${datum.x},\r\nProduction: ${datum.y.toFixed(1)}`
//     //       }
//     //       labelComponent={
//     //         <VictoryTooltip style={{ fontSize: 10 }} orientation={"bottom"} />
//     //       }
//     //     />
//     //   }
//     // >
//     //   <VictoryAxis
//     //     animate={{ duration: 500 }}
//     //     tickValues={dates}
//     //     tickFormat={(date: string) => {
//     //       return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
//     //     }}
//     //     tickLabelComponent={
//     //       <VictoryLabel
//     //         textAnchor={"middle"}
//     //         angle={-35}
//     //         // dy={-10}
//     //         // dx={20}
//     //         style={{
//     //           fontSize: 10,
//     //           stroke: colors.mediumGray,
//     //           strokeWidth: 0.4,
//     //         }}
//     //       />
//     //     }
//     //     style={{
//     //       axis: {
//     //         stroke: colors.iconGray,
//     //       },
//     //       ticks: {
//     //         stroke: colors.iconGray,
//     //         size: 12,
//     //       },
//     //       grid: {
//     //         display: "none",
//     //       },
//     //     }}
//     //   />
//     //   <VictoryAxis
//     //     animate={{ duration: 500 }}
//     //     dependentAxis
//     //     tickLabelComponent={
//     //       <VictoryLabel
//     //         textAnchor={"end"}
//     //         style={{
//     //           fontSize: 10,
//     //           stroke: colors.mediumGray,
//     //           strokeWidth: 0.4,
//     //         }}
//     //       />
//     //     }
//     //     style={{
//     //       axis: {
//     //         stroke: colors.iconGray,
//     //       },
//     //       ticks: {
//     //         stroke: colors.iconGray,
//     //         size: 8,
//     //       },
//     //       grid: {
//     //         display: "none",
//     //       },
//     //     }}
//     //   />
//     //   <VictoryBar
//     //     data={lineData}
//     //     animate={{ duration: 1000 }}
//     //     style={{ data: { fill: colors.primaryTransparent70 } }}
//     //   />
//     //   {/* <VictoryLine y={(datum) => Math.sin(2 * Math.PI * datum.x)}/> */}
//     // </VictoryChart>
//   );
// };

import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { DateTime } from "luxon";

export const getCollisionReportHTML = (
  title: string,
  report: ICollisionReport[],
  vehicleName: string,
  fuelType: string,
  serialNo: string,
  email: string,
  startDate: string,
  endDate: string
) => {
  let rows: string = ``;
  for (let i = 0; i < report.length; i++) {
    let row = "";
    if (i % 2 === 0) {
      row += `
              <tr style="background-color: #eeeeee;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].name
                  }</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].date,
                    { zone: "utc" }
                  ).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].location.lat
                  }, ${report[i].location.lng}</td>
                  <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].driver_name
                  }</td>
              </tr>`;
    } else {
      row += `
              <tr style="background-color: white;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].name
                  }</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].date,
                    { zone: "utc" }
                  ).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].location.lat
                  }, ${report[i].location.lng}</td>
                  <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].driver_name
                  }</td>
              </tr>`;
    }
    rows += row;
    row = "";
  }
  const html: string = `
      <html>
          <head>
              <style>
                  #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: "100%";
                  }
  
                  #customers td,
                  #customers th {
                      text-align: center;
                      border: 1px solid #ddd;
                      padding: 8px;
                  }
  
                  #customers tr:nth-child(even) {
                      background-color: #f2f2f2;
                  }
  
                  #customers tr:hover {
                      background-color: #ddd;
                  }
  
                  #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: center;
                      background-color: #04AA6D;
                      color: white;
                  }
              </style>
          </head>
  
  <body>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${title}</h3>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${vehicleName}</h3>
      <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Serial No. ${serialNo} Type: ${fuelType}</h4>
          <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Start Date: ${startDate} End Date: ${endDate}</h4>
          <table style="width: 100%;border-collapse: collapse;">
              <tr style="background-color: #4caf50; color: white;font-family: Arial, Helvetica, sans-serif;">
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Vehicle</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Date/Time</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Location <br>(Lat, Lng)</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Driver</td>
              </tr>
              ${rows}
          </table>
          <footer style=" display: flex; flex-direction: row; justify-content: space-between;">
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed by ${email}</p>
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed on ${new Date().toDateString()} ${new Date().toLocaleTimeString()}
              </p>
          </footer>
  </body>
  
  
  </html>
      `;
  return html;
};
export const getHistoryReportHTML = (
  title: string,
  report: IHistoryReport[],
  vehicleName: string,
  fuelType: string,
  serialNo: string,
  email: string,
  startDate: string,
  endDate: string
) => {
  let rows: string = ``;
  for (let i = 0; i < report.length; i++) {
    let row = "";
    if (i % 2 === 0) {
      row += `
              <tr style="background-color: #eeeeee;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].gps_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                    <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                      report[i].speed
                    }</td>
                    <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                      report[i].mileage
                    }</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].latitude
                  }, ${report[i].longitude}</td>
              </tr>`;
    } else {
      row += `
              <tr style="background-color: white;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].gps_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].speed
                  }</td>
                  <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].mileage
                  }</td>
                  <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].latitude
                  }, ${report[i].longitude}</td>
              </tr>`;
    }
    rows += row;
    row = "";
  }
  const html: string = `
      <html>
          <head>
              <style>
                  #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: "100%";
                  }
  
                  #customers td,
                  #customers th {
                      text-align: center;
                      border: 1px solid #ddd;
                      padding: 8px;
                  }
  
                  #customers tr:nth-child(even) {
                      background-color: #f2f2f2;
                  }
  
                  #customers tr:hover {
                      background-color: #ddd;
                  }
  
                  #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: center;
                      background-color: #04AA6D;
                      color: white;
                  }
              </style>
          </head>
  
  <body>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${title}</h3>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${vehicleName}</h3>
      <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Serial No. ${serialNo} Type: ${fuelType}</h4>
          <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Start Date: ${startDate} End Date: ${endDate}</h4>
          <table style="width: 100%;border-collapse: collapse;">
              <tr style="background-color: #4caf50; color: white;font-family: Arial, Helvetica, sans-serif;">
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Date/Time</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Speed <br>(km/h)</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Mileage <br>(km)</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Position <br>(Lat, Lng)</td>
              </tr>
              ${rows}
          </table>
          <footer style=" display: flex; flex-direction: row; justify-content: space-between;">
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed by ${email}</p>
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed on ${new Date().toDateString()} ${new Date().toLocaleTimeString()}
              </p>
          </footer>
  </body>
  
  
  </html>
      `;
  return html;
};

export const getIgnitionReportHTML = (
  title: string,
  report: IIgnitionReport[],
  vehicleName: string,
  fuelType: string,
  serialNo: string,
  email: string,
  startDate: string,
  endDate: string
) => {
  let rows: string = ``;
  for (let i = 0; i < report.length; i++) {
    let row = "";
    if (i % 2 === 0) {
      row += `
              <tr style="background-color: #eeeeee;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].start_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].start_latitude
                  }, ${report[i].start_longitude}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].end_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].end_latitude
                  }, ${report[i].end_longitude}</td>
              </tr>`;
    } else {
      row += `
              <tr style="background-color: white;">
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].start_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].start_latitude
                  }, ${report[i].start_longitude}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${DateTime.fromISO(
                    report[i].end_time,
                    { zone: "utc" }
                  )
                    .toLocal()
                    .toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}</td>
                  <td style=" font-family: Arial, Helvetica, sans-serif;text-align: center;">${
                    report[i].end_latitude
                  }, ${report[i].end_longitude}</td>
              </tr>`;
    }
    rows += row;
    row = "";
  }
  const html: string = `
      <html>
          <head>
              <style>
                  #customers {
                      font-family: Arial, Helvetica, sans-serif;
                      border-collapse: collapse;
                      width: "100%";
                  }
  
                  #customers td,
                  #customers th {
                      text-align: center;
                      border: 1px solid #ddd;
                      padding: 8px;
                  }
  
                  #customers tr:nth-child(even) {
                      background-color: #f2f2f2;
                  }
  
                  #customers tr:hover {
                      background-color: #ddd;
                  }
  
                  #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: center;
                      background-color: #04AA6D;
                      color: white;
                  }
              </style>
          </head>
  
  <body>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${title}</h3>
      <h3 style="font-family: Helvetica, sans-serif;text-align: center;">${vehicleName}</h3>
      <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Serial No. ${serialNo} Type: ${fuelType}</h4>
          <h4 style="font-family: Helvetica, sans-serif;text-align: center;">Start Date: ${startDate} End Date: ${endDate}</h4>
          <table style="width: 100%;border-collapse: collapse;">
              <tr style="background-color: #4caf50; color: white;font-family: Arial, Helvetica, sans-serif;">
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Ignition ON <br> Date/Time</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Ignition ON <br> (Lat,Lng)</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Ignition OFF <br> Date/Time</td>
              <td style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Ignition OFF <br> (Lat,Lng)</td>
              </tr>
              ${rows}
          </table>
          <footer style=" display: flex; flex-direction: row; justify-content: space-between;">
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed by ${email}</p>
              <p style="font-family: Arial, Helvetica, sans-serif;text-align: center;">Printed on ${new Date().toDateString()} ${new Date().toLocaleTimeString()}
              </p>
          </footer>
  </body>
  
  
  </html>
      `;
  return html;
};

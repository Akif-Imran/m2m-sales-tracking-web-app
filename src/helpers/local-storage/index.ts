/* import {
  DeviceResponseObjectWithData,
  GetUserResponseObject,
  SearchedMachine,
} from "../../types/api-types";

export const getTargetFromLocalStorage = async (
  devices: DeviceResponseObjectWithData<
    any,
    GetUserResponseObject<string[]>[]
  >[]
) => {
  let arr: SearchedMachine[] = [];
  let index = 1;
  for (let device of devices) {
    const targetValue = localStorage.getItem(device._id);
    arr.push({
      ...device,
      target: targetValue === null ? 5000 : parseInt(targetValue),
      machineNo: index,
    });
    index++;
  }
  return arr;
};
 */
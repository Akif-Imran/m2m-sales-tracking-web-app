import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  FileButton,
  Flex,
  Grid,
  Group,
  Menu,
  Modal,
  Radio,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  selectLeadsWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { useGStyles, noImageStyle, bodyTextStyle } from "@global-styles";
import {
  IconCalendar,
  IconCornerDownRight,
  IconFilterFilled,
  IconId,
  IconPlus,
  IconRotateClockwise2,
  IconSearch,
  IconTable,
  IconTrash,
  IconUpload,
  // IconUserCog,
} from "@tabler/icons-react";
import {
  DATE_FORMAT_YYYY_MM_DD,
  modalOverlayPropsHelper,
  openConfirmModalHelper,
  openDeleteModalHelper,
} from "@helpers";
import { notify } from "@utility";
import { colors } from "@theme";
import { deleteLead } from "@slices";
import { _AddLeadModal, _AssignEngineerModal, _LeadCard } from "../components";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY, projectStatusColors } from "@constants";
import { useAuthContext } from "@contexts";
import { Outlet, useSearchParams } from "react-router-dom";
import { removeProject, updateStatusProject } from "@thunks";
import { useToggle } from "@mantine/hooks";
import { BASE_URL } from "@api";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormik } from "formik";
import * as yup from "yup";
import { uploadFile } from "@services";

interface OwnProps {}

interface LeadSort {
  statusName: string;
  salesPerson: string;
  // Add other properties as needed
}

interface IForm {
  hasQuotation: boolean;
  hasFile: boolean;
  quotationDate?: string;
  quotationFile?: string;
  quotationAmount?: number;
}

const schema: yup.ObjectSchema<IForm> = yup.object().shape({
  hasQuotation: yup.boolean().required("Quotation is required."),
  hasFile: yup
    .boolean()
    .when(["hasQuotation"], {
      is: true,
      then: (schema) =>
        schema.oneOf([true], "Quotation file is required").required("Quotation file is required"),
      otherwise: (schema) => schema.oneOf([false]).required("File error"),
    })
    .required(),
  quotationDate: yup.string().when(["hasQuotation"], {
    is: true,
    then: (schema) => schema.required("Quotation Date is required"),
    otherwise: (schema) => schema.optional(),
  }),
  quotationFile: yup.string().when(["hasQuotation"], {
    is: true,
    then: (schema) => schema.nullable("Quotation Date is required"),
    otherwise: (schema) => schema.optional(),
  }),
  quotationAmount: yup
    .number()
    .min(0)
    .when(["hasQuotation"], {
      is: true,
      then: (schema) => schema.required("Quotation Date is required"),
      otherwise: (schema) => schema.optional(),
    }),
});

export const Leads: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, token, user },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [viewMode, toggle] = useToggle(["cards", "list"]);
  const [searchParams, _setSearchParams] = useSearchParams();
  const modal = searchParams.get("open");
  const customerId = searchParams.get("customerId") || "";

  const [searchQuery, setSearchQuery] = React.useState("");
  const leads = useAppSelector(selectLeadsWithRecords);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [addModalOpened, setAddModalOpened] = React.useState(modal === "add");
  const [assignEngineerModalOpened, setAssignEngineerModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof leads>([]);

  const { leadStatus: leadsStatusList } = useAppSelector(selectRecordsForDropdown);

  const [visible, setVisible] = React.useState<boolean>(false);
  const [file, setFile] = React.useState({} as File);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  const [_quotationDate, setQuotationDate] = React.useState(new Date());
  const [isCreating, setIsCreating] = React.useState<boolean>(false);

  const [selectedLead, setSelectedLead] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<LeadSort>({
    statusName: "asc", // Initial sorting order (asc or desc)
    salesPerson: "asc",
  });

  const showUpdateStatusModal = (statusId: number, leadId: string) => {
    setSelectedStatus(statusId.toString());
    setSelectedLead(leadId);
    setVisible(true);
  };
  const showAssignEngineerModal = (leadId: string) => {
    setSelectedLead(leadId);
    setAssignEngineerModalOpened(true);
  };

  const hideUpdateStatusModal = () => setVisible(false);
  const hideAssignEngineerModal = () => setAssignEngineerModalOpened(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = leads.filter((lead) => lead.name.toLowerCase().includes(query.toLowerCase()));
    setSearchedData(filtered);
  };

  const sortData = (columnName: keyof LeadSort) => {
    const sortOrderCopy = { ...sortOrder };
    sortOrderCopy[columnName] = sortOrderCopy[columnName] === "asc" ? "desc" : "asc";
    setSortOrder(sortOrderCopy);

    // Sort your data based on the selected column
    // For example, if columnName is 'status':
    const sortedData = [...searchedData].sort((a, b) => {
      const valueA = a[columnName]?.toString().toLowerCase();
      const valueB = b[columnName]?.toString().toLowerCase();
      if (!valueA || !valueB) {
        notify("Sort", "Invalid paramters", "error");
        return -1;
      }
      if (sortOrderCopy[columnName] === "asc") {
        return valueA?.localeCompare(valueB);
      } else {
        return valueB?.localeCompare(valueA);
      }
    });

    setSearchedData(sortedData);
  };

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Prospect`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Prospect? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Prospect",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeProject({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            if (res.success) {
              dispatch(deleteLead(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete Prospect: ", err?.message);
            notify("Delete Prospect", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });

        notify("Delete Prospect", "Prospect deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Prospect", "Operation canceled!", "error"),
    });
  };

  const handleMoveToProjects = (prospectId: string) => {
    openConfirmModalHelper({
      theme: theme,
      title: `Move to Projects`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to move this Prospect to Projects? This will mark the prospect as a
          project with status of "WORK ORDER RECEIVED". This action is irreversible.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Move",
      onConfirm: () => {
        dispatch(
          updateStatusProject({
            token,
            id: prospectId,
            body: {
              status: 4,
            },
          })
        )
          .unwrap()
          .then((res) => {
            notify("Move to Projects", res?.message, res.success ? "success" : "error");
            if (res.success) {
              // dispatch(modifyLeadStatus(res.data));
            }
          })
          .catch((err) => {
            console.log("Move to Projects", err?.message);
            notify("Move to Projects", "An error occurred", "error");
          });
      },
      onCancel: () => notify("Delete Prospect", "Operation canceled!", "error"),
    });
  };

  const handleOnChangeStatus = (value: string | null, quotation?: Quotation) => {
    if (!value) {
      notify("Update Prospect Status", "Invalid status value", "error");
      return;
    }
    dispatch(
      updateStatusProject({
        token,
        id: selectedLead,
        body: {
          status: parseInt(value),
          quotation,
        },
      })
    )
      .unwrap()
      .then((res) => {
        notify("Prospect Status", res?.message, res.success ? "success" : "error");
        if (res.success) {
          // dispatch(modifyLeadStatus(res.data));
          hideUpdateStatusModal();
        }
      })
      .catch((err) => {
        console.log("Update Prospect Status: ", err?.message);
        notify("Prospect Status", "An error occurred", "error");
      })
      .finally(() => {
        setIsCreating((_prev) => false);
      });
  };

  const handleStatusFilter = (status: string) => {
    if (status === "0") {
      setSearchedData(leads);
    } else {
      const parsed = parseInt(status);
      if (isNaN(parsed)) return;
      const filtered = leads.filter((prospect) => prospect.status === parsed);
      setSearchedData(filtered);
    }
  };

  const handleOnChangeQuotationDate = (value: DateValue) => {
    if (value) {
      setQuotationDate(value);
      form.setValues((prev) => ({
        ...prev,
        quotationDate: DATE_FORMAT_YYYY_MM_DD(value),
      }));
    }
  };

  const handleImageChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Prospect Image not uploaded", "error");
      return;
    }
    setFile(file);
    form.setValues((prev) => ({ ...prev, hasFile: true }));
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const dataUri = e?.target?.result as string;
    //   if (dataUri) {
    //     form.setValues((prev) => ({ ...prev, hasFile: true }));
    //   }
    // };
    // reader.readAsDataURL(file);
  };

  const form = useFormik<IForm>({
    initialValues: {
      hasFile: false,
      hasQuotation: false,
      quotationAmount: 0,
      quotationDate: "",
      quotationFile: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log(values);
      setIsCreating((_prev) => true);
      if (values.hasQuotation) {
        if (!values.hasFile) {
          notify("File Upload", "Quotation file not uploaded", "error");
          return;
        } else {
          const res = await uploadFile(token, file);
          console.log("Prospect Image Upload: ", res);
          if (res.statusCode === 200 || res.statusCode === 201) {
            values.quotationFile = res.data;
          } else {
            setIsCreating((_prev) => false);
            notify("Update Prospect Status", res?.message, "error");
            return;
          }
          handleOnChangeStatus(selectedStatus, {
            quotationAmount: values.quotationAmount || 0,
            quotationDate: values.quotationDate || "",
            quotationFile: values.quotationFile,
          });
        }
      } else {
        handleOnChangeStatus(selectedStatus);
      }
    },
  });

  const handleCancel = () => {
    form.resetForm();
    setFile({} as File);
    setQuotationDate(new Date());
    hideUpdateStatusModal();
  };

  React.useEffect(() => {
    setSearchedData(leads);
  }, [leads]);

  let icon: JSX.Element;
  if (viewMode === "cards") {
    icon = <IconId size={22} color={colors.white} />;
  } else {
    icon = <IconTable size={22} color={colors.white} />;
  }

  const rows =
    searchedData.length === 0 ? (
      <Container>
        <Center>No Prospects</Center>
      </Container>
    ) : (
      <>
        {searchedData.map((prospect, index) => {
          const value = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: prospect.value.currency,
            maximumFractionDigits: 2,
          }).format(prospect.value.amount);

          if (viewMode === "cards") {
            return (
              <Grid.Col span={4} key={prospect._id}>
                <_LeadCard
                  item={prospect}
                  handleDelete={handleDelete}
                  assignEngineer={showAssignEngineerModal}
                  updateStatus={showUpdateStatusModal}
                  moveToProject={handleMoveToProjects}
                />
              </Grid.Col>
            );
          } else if (viewMode === "list") {
            return (
              <tr key={prospect._id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar
                    src={
                      prospect?.images.length > 0
                        ? `${BASE_URL}\\${prospect?.images[0]}`
                        : "/company.png"
                    }
                    size={50}
                    //@ts-expect-error style works
                    styles={prospect.images.length > 0 ? undefined : noImageStyle}
                  />
                </td>
                <td>{prospect.name}</td>
                <td>{prospect.description}</td>
                <td>
                  <Badge
                    variant="filled"
                    color={projectStatusColors[prospect.status]}
                    styles={{
                      root: {
                        width: "100%",
                      },
                    }}
                  >
                    {prospect.statusName}
                  </Badge>
                </td>
                <td>{prospect.type}</td>
                <td>{value}</td>
                <td>
                  {DateTime.fromISO(prospect.contractDate).toLocal().toFormat(DAY_MM_DD_YYYY)}
                </td>
                <td>
                  {DateTime.fromISO(prospect.deliveryDate).toLocal().toFormat(DAY_MM_DD_YYYY)}
                </td>
                <td>{prospect.quotation}</td>
                <td>
                  {prospect.salesPerson !== user?._id
                    ? prospect?.salesPersonValue?.name || "N/A"
                    : "(You)"}
                </td>
                <td>
                  {prospect?.engineer ? prospect?.engineerValue?.name || "N/A" : "Not Assigned"}
                </td>
                <td>{prospect?.company?.name || "N/A"}</td>
                <td>
                  <Group>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => showUpdateStatusModal(prospect.status, prospect._id)}
                    >
                      <IconRotateClockwise2 />
                    </ActionIcon>
                    <ActionIcon
                      color="gray"
                      size={"sm"}
                      onClick={() => handleMoveToProjects(prospect._id)}
                    >
                      <IconCornerDownRight />
                    </ActionIcon>
                    {isAdmin && (
                      <React.Fragment>
                        {/* <ActionIcon
                          color="gray"
                          size={"sm"}
                          onClick={() => showAssignEngineerModal(prospect._id)}
                        >
                          <IconUserCog />
                        </ActionIcon> */}
                        <ActionIcon
                          color="red"
                          size={"sm"}
                          onClick={() => handleDelete(prospect._id)}
                        >
                          <IconTrash />
                        </ActionIcon>
                      </React.Fragment>
                    )}
                  </Group>
                </td>
              </tr>
            );
          } else {
            return (
              <_LeadCard
                key={prospect._id}
                item={prospect}
                handleDelete={handleDelete}
                assignEngineer={showAssignEngineerModal}
                updateStatus={showUpdateStatusModal}
                moveToProject={handleMoveToProjects}
              />
            );
          }
        })}
      </>
    );

  let content: JSX.Element;
  if (viewMode === "cards") {
    content = <Grid columns={12}>{rows}</Grid>;
  } else if (viewMode === "list") {
    content = (
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={4}>Prospect</th>
                <th colSpan={6}>Prospect Details</th>
                <th colSpan={1}>Contact</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th onClick={() => sortData("statusName")}>
                  Status {sortOrder.statusName === "asc" ? "▲" : "▼"}
                </th>
                <th>Prospect Type</th>
                <th>Value</th>
                <th>Contract Date</th>
                <th>Delivery Date</th>
                <th>Quotation</th>
                <th onClick={() => sortData("salesPerson")}>
                  Sales Person {sortOrder.salesPerson === "asc" ? "▲" : "▼"}
                </th>
                <th>Engineer</th>
                <th>Company Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
    );
  } else {
    content = (
      <Grid>
        <Grid.Col span={4}>{rows}</Grid.Col>
        <Grid.Col span={8}>
          <Outlet />
        </Grid.Col>
      </Grid>
    );
  }

  console.log(form.errors);
  return (
    <Stack spacing={"xs"}>
      <Flex gap={"md"} className={gclasses.searchContainer}>
        <TextInput
          value={searchQuery}
          className={gclasses.searchInput}
          placeholder="Search by any field"
          icon={<IconSearch size={16} />}
          onChange={(e) => onChangeSearch(e.target?.value)}
          // rightSection={
          //   <IconFilter size={14} color={colors.borderColor} onClick={showFilterModal} />
          // }
        />
        <Menu>
          <Menu.Target>
            <Tooltip label="Status Filter" position="bottom" withArrow withinPortal>
              <ActionIcon variant="filled" size={"2.2rem"} color={theme.primaryColor}>
                <IconFilterFilled size={16} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Status Filters</Menu.Label>
            {[{ label: "All", value: "0" }].concat(leadsStatusList).map((status) => {
              return (
                <Menu.Item onClick={() => handleStatusFilter(status.value)}>
                  {status.label}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="Toggle Card / Table View" position="bottom" withArrow withinPortal>
          <ActionIcon
            variant="filled"
            size={"2.2rem"}
            color={theme.primaryColor}
            onClick={() => toggle()}
          >
            {icon}
          </ActionIcon>
        </Tooltip>
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
        >
          Prospect
        </Button>
      </Flex>

      {content}
      <_AddLeadModal
        title="Add Prospect"
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        companyId={customerId}
      />
      <_AssignEngineerModal
        title="Assign Engineer"
        opened={assignEngineerModalOpened}
        onClose={hideAssignEngineerModal}
        projectId={selectedLead}
      />
      <Modal
        centered
        radius="md"
        opened={visible}
        onClose={handleCancel}
        title="Prospect Status"
        scrollAreaComponent={ScrollArea.Autosize}
        withinPortal
        withOverlay
        overlayProps={modalOverlayPropsHelper(theme)}
      >
        <Radio.Group
          value={selectedStatus}
          name="userFilter"
          defaultValue="7"
          onChange={(value) => {
            setSelectedStatus(value);
            form.setValues((prev) => ({ ...prev, hasQuotation: value === "3" }));
          }}
        >
          <div className={gclasses.radioContainer}>
            {leadsStatusList.map((value) => {
              return <Radio value={value.value} label={value.label} key={value.value} />;
            })}
          </div>
        </Radio.Group>
        {form.values.hasQuotation && (
          <React.Fragment>
            <Group align="flex-start" grow mt={"md"}>
              <TextInput
                required
                withAsterisk={false}
                label="Quotation Amount"
                name="quotationAmount"
                id="quotationAmount"
                type="number"
                value={form.values.quotationAmount}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.touched.quotationAmount && form.errors.quotationAmount
                    ? `${form.errors.quotationAmount}`
                    : null
                }
              />
              <DatePickerInput
                dropdownType="modal"
                required
                // value={quotationDate}
                withAsterisk={false}
                name="quotationDate"
                id="quotationDate"
                label="Quotation Date"
                onBlur={form.handleBlur}
                onChange={handleOnChangeQuotationDate}
                icon={<IconCalendar size={16} stroke={1.5} color={colors.titleText} />}
                error={
                  form.touched.quotationDate && form.errors.quotationDate
                    ? `${form.errors.quotationDate}`
                    : null
                }
              />
            </Group>
            <Flex direction={"row"} align={"center"} justify={"space-between"} mt={"md"}>
              {form.values.hasFile ? (
                <Text {...bodyTextStyle}>{file?.name}</Text>
              ) : (
                <Text {...bodyTextStyle}>No file uploaded</Text>
              )}
              {/* <div className={gclasses.fileUploadButton}> */}
              <FileButton onChange={handleImageChange} accept="application/pdf">
                {(props) => (
                  <Button
                    radius={"xl"}
                    variant="filled"
                    color={theme.primaryColor}
                    rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                    {...props}
                  >
                    Quotation
                  </Button>
                )}
              </FileButton>
              {/* </div> */}
            </Flex>
            {form.touched.hasFile && form.errors.hasFile ? (
              <Text fz="sm" color="red">
                {form.errors.hasFile}
              </Text>
            ) : null}
            {form.touched.quotationAmount && form.errors.quotationAmount ? (
              <Text fz="sm" color="red">
                {form.errors.quotationAmount}
              </Text>
            ) : null}
          </React.Fragment>
        )}
        <Group align="flex-end" position="right" mt={"md"}>
          <Button variant="outline" onClick={handleCancel} size="xs">
            Cancel
          </Button>
          <Button
            size="xs"
            variant="filled"
            loading={isCreating}
            onClick={() => form.handleSubmit()}
          >
            Save
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default Leads;

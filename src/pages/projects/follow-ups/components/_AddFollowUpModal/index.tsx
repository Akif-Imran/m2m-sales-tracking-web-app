import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Card,
  FileButton,
  Flex,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { modalOverlayPropsHelper } from "@helpers";
import { useAuthContext } from "@contexts";
import {
  selectCompanyContact,
  selectProjectWithRecords,
  selectRecordsForDropdown,
  useAppDispatch,
  useAppSelector,
} from "@store";
import { YYYY_MM_DD_HH_MM_SS_A, currencyList } from "@constants";
import { IconUpload } from "@tabler/icons-react";
import { useGStyles } from "../../../../../styles";
import { notify } from "@utility";
import { DateTimePicker } from "@mantine/dates";
import { addFollowUp } from "@slices";
import { colors } from "@theme";
import * as yup from "yup";
import { createFollowUp } from "@thunks";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  companyId?: string;
  projectId?: string;
}

interface IFollowUpForm
  extends Omit<IFollowUp, "_id" | "__v" | "createdBy" | "createdAt" | "isActive" | "company"> {}

const schema: yup.ObjectSchema<IFollowUpForm> = yup.object().shape({
  contactId: yup.string().required("Who is the meeting with?  is required"),
  projectId: yup.string().required("Project is required"),
  meetingDate: yup.string().required("Meeting date is required"),
  meetingPlace: yup.string().required("Meeting place is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  meetingAgenda: yup.string().required("Meeting agenda is required"),
  meetingSummary: yup.string().required("Meeting summary is required"),
  nextMeetingPlace: yup.string().optional(),
  nextMeetingDate: yup.string().optional(),
  nextMeetingAgenda: yup.string().optional(),
  expenseName: yup.string().optional(),
  expenseType: yup.string().optional(),
  expensePrice: yup
    .object()
    .shape({
      amount: yup.number().required("Expense amount is required"),
      currency: yup.string().required("Currency is required"),
    })
    .optional(),
  expenseDocument: yup.string().nullable(),
  customerId: yup.string().required("Customer is required"),
});

const _AddFollowUpModal: React.FC<OwnProps> = ({
  title,
  opened,
  onClose,
  projectId,
  companyId,
}) => {
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjectWithRecords);
  const { projects: projectsList, companies: companiesList } =
    useAppSelector(selectRecordsForDropdown);
  const contacts = useAppSelector(selectCompanyContact);

  const [isCreating, setIsCreating] = React.useState(false);
  const [contactList, setContactList] = React.useState<IDropDownList>([]);
  const [companyProjectList, setCompanyProjectsList] = React.useState<IDropDownList>([]);

  const form = useFormik<IFollowUpForm>({
    initialValues: {
      contactId: "",
      projectId: "",
      meetingDate: DateTime.now().toFormat(YYYY_MM_DD_HH_MM_SS_A),
      meetingPlace: "",
      address: "",
      city: "",
      state: "",
      country: "",
      meetingAgenda: "",
      meetingSummary: "",
      nextMeetingPlace: "",
      nextMeetingDate: DateTime.now().toFormat(YYYY_MM_DD_HH_MM_SS_A),
      nextMeetingAgenda: "",
      expenseName: "",
      expenseType: "",
      expensePrice: {
        amount: 0,
        currency: "MYR",
      },
      expenseDocument: "",
      customerId: companyId || "",
    },
    validationSchema: schema,
    onSubmit(values, helpers) {
      console.log(values);
      setIsCreating((_prev) => true);
      dispatch(
        createFollowUp({
          token,
          followUp: values,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.success) {
            dispatch(addFollowUp(res.data));
            helpers.resetForm();
            onClose();
          }
        })
        .catch((err) => {
          console.log("Add Follow: ", err?.message);
          notify("Add Follow Up", "An error occurred", "error");
        })
        .finally(() => {
          setIsCreating((_prev) => false);
        });
    },
  });

  const handleReceiptChange = (file: File) => {
    if (file === null) {
      notify("Image Upload", "Company logo not uploaded", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e?.target?.result as string;
      if (dataUri) {
        form.setValues((prev) => ({ ...prev, expenseDocument: dataUri }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOnChangeValueCurrency = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({
      ...prev,
      expensePrice: {
        amount: prev.expensePrice?.amount || 0,
        currency: value,
      },
    }));
  };

  const handleOnChangeCompany = (value: string | null) => {
    if (!value) return;
    form.setValues((prev) => ({ ...prev, customerId: value }));
    const project_s = projects
      .filter((project) => project.customerId === value)
      .map((project) => ({
        label: project.name,
        value: project._id,
      }));
    const contact_s = contacts.data
      .filter((contact) => contact.customerId === value)
      .map((contact) => ({
        label: contact.name,
        value: contact._id,
      }));
    setCompanyProjectsList(project_s);
    setContactList(contact_s);
  };

  const handleCancel = () => {
    form.resetForm();
    onClose();
  };

  const setProjectAndContactsBasedOnCompany = React.useCallback(
    (companyId: string) => {
      const project_s = projects
        .filter((project) => project.customerId === companyId)
        .map((project) => ({
          label: project.name,
          value: project._id,
        }));
      const contact_s = contacts.data
        .filter((contact) => contact.customerId === companyId)
        .map((contact) => ({
          label: contact.name,
          value: contact._id,
        }));
      setContactList(contact_s);
      setCompanyProjectsList(project_s);
    },
    [contacts.data, projects]
  );

  React.useEffect(() => {
    if (!form.values.customerId) return;
    setProjectAndContactsBasedOnCompany(form.values.customerId);
  }, [form.values.customerId, setProjectAndContactsBasedOnCompany]);

  React.useEffect(() => {
    if (!companyId) {
      setCompanyProjectsList(projectsList);
      return;
    }
    form.setValues((prev) => ({ ...prev, customerId: companyId }));
    setProjectAndContactsBasedOnCompany(companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, opened, setProjectAndContactsBasedOnCompany]);

  React.useEffect(() => {
    if (!projectId) return;
    form.setValues((prev) => ({ ...prev, projectId: projectId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, opened]);

  return (
    <Modal
      // size="xl"
      fullScreen
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      styles={{
        body: {
          backgroundColor: colors.lightGray,
        },
        header: {
          backgroundColor: colors.lightGray,
        },
        content: {
          backgroundColor: colors.lightGray,
        },
      }}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Grid columns={24}>
        <Grid.Col span={12}>
          <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
            <Stack spacing={"xs"}>
              <Select
                required
                searchable
                withAsterisk={false}
                label="Company"
                placeholder="Select a company"
                allowDeselect={false}
                nothingFound="No company found"
                value={form.values.customerId}
                data={companiesList}
                onChange={handleOnChangeCompany}
                error={
                  form.errors.customerId && form.touched.customerId
                    ? `${form.errors.customerId}`
                    : null
                }
              />
              <Group grow align="flex-start">
                <Select
                  required
                  searchable
                  withAsterisk={false}
                  label="Lead/Project"
                  placeholder="Select a project"
                  allowDeselect={false}
                  nothingFound="No projects found"
                  value={form.values.projectId}
                  data={companyProjectList}
                  onChange={(value) => {
                    if (!value) return;
                    form.setValues((prev) => ({ ...prev, projectId: value }));
                  }}
                  error={
                    form.errors.projectId && form.touched.projectId
                      ? `${form.errors.projectId}`
                      : null
                  }
                />
                <Select
                  required
                  searchable
                  withAsterisk={false}
                  label="Meeting With"
                  placeholder="Select contact"
                  allowDeselect={false}
                  nothingFound="No contacts found"
                  value={form.values.contactId}
                  data={contactList}
                  onChange={(value) => {
                    if (!value) return;
                    form.setValues((prev) => ({ ...prev, contactId: value }));
                  }}
                  error={
                    form.errors.contactId && form.touched.contactId
                      ? `${form.errors.contactId}`
                      : null
                  }
                />
              </Group>
              <Group grow align="flex-start">
                <DateTimePicker
                  required
                  withAsterisk={false}
                  dropdownType="modal"
                  label="Meeting Date/Time"
                  valueFormat="YYYY-MM-DD hh:mm A"
                  clearable={false}
                  placeholder="Pick date and time"
                  name="meetingDate"
                  id="meetingDate"
                  onBlur={form.handleBlur}
                  onChange={(date) => {
                    if (!date) return;
                    form.setValues((prev) => ({
                      ...prev,
                      meetingDate: date?.toISOString(),
                    }));
                  }}
                  error={
                    form.errors.meetingDate && form.touched.meetingDate
                      ? `${form.errors.meetingDate}`
                      : null
                  }
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Meeting Place"
                  name="meetingPlace"
                  id="meetingPlace"
                  value={form.values.meetingPlace}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.meetingPlace && form.touched.meetingPlace
                      ? `${form.errors.meetingPlace}`
                      : null
                  }
                />
              </Group>
              <TextInput
                required
                withAsterisk={false}
                label="Address"
                name="address"
                id="address"
                value={form.values.address}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.address && form.touched.address ? `${form.errors.address}` : null
                }
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="City"
                  name="city"
                  id="city"
                  value={form.values.city}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.errors.city && form.touched.city ? `${form.errors.city}` : null}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="State"
                  name="state"
                  id="state"
                  value={form.values.state}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.errors.state && form.touched.state ? `${form.errors.state}` : null}
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Country"
                  name="country"
                  id="country"
                  value={form.values.country}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.country && form.touched.country ? `${form.errors.country}` : null
                  }
                />
              </Group>
              <Textarea
                rows={5}
                label="Agenda"
                name="meetingAgenda"
                id="meetingAgenda"
                value={form.values.meetingAgenda}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.meetingAgenda && form.touched.meetingAgenda
                    ? `${form.errors.meetingAgenda}`
                    : null
                }
              />
              <Textarea
                rows={5}
                label="Summary"
                name="meetingSummary"
                id="meetingSummary"
                value={form.values.meetingSummary}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.meetingSummary && form.touched.meetingSummary
                    ? `${form.errors.meetingSummary}`
                    : null
                }
              />
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          <Stack spacing={"xs"}>
            <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
              <Text size={"xl"} underline>
                Next Visit
              </Text>
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Place"
                  name="nextMeetingPlace"
                  id="nextMeetingPlace"
                  value={form.values.nextMeetingPlace}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.nextMeetingPlace && form.touched.nextMeetingPlace
                      ? `${form.errors.nextMeetingPlace}`
                      : null
                  }
                />
                <DateTimePicker
                  required
                  dropdownType="modal"
                  withAsterisk={false}
                  label="Date/Time"
                  valueFormat="YYYY-MM-DD hh:mm A"
                  clearable={false}
                  placeholder="Pick date and time"
                  name="nextMeetingDate"
                  id="nextMeetingDate"
                  onBlur={form.handleBlur}
                  onChange={(date) => {
                    if (!date) return;
                    form.setValues((prev) => ({
                      ...prev,
                      nextMeetingDate: date?.toISOString(),
                    }));
                  }}
                  error={
                    form.errors.nextMeetingDate && form.touched.nextMeetingDate
                      ? `${form.errors.nextMeetingDate}`
                      : null
                  }
                />
              </Group>
              <Textarea
                rows={5}
                label="Agenda"
                name="nextMeetingAgenda"
                id="nextMeetingAgenda"
                value={form.values.nextMeetingAgenda}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.nextMeetingAgenda && form.touched.nextMeetingAgenda
                    ? `${form.errors.nextMeetingAgenda}`
                    : null
                }
              />
            </Card>
            <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"}>
              <Text size={"xl"} underline>
                Expense / Claim
              </Text>
              <Flex direction={"column"} align={"center"} justify={"flex-end"}>
                {form.values.expenseDocument ? (
                  <Avatar src={form.values.expenseDocument} radius={"md"} size={rem(170)} />
                ) : (
                  <div
                    style={{
                      width: rem(170),
                      height: rem(170),
                      borderRadius: theme.radius.md,
                      backgroundColor: `${theme.colors[theme.primaryColor][1]}`,
                    }}
                  />
                )}
                <div className={gclasses.fileUploadButton}>
                  <FileButton onChange={handleReceiptChange} accept="image/png,image/jpeg">
                    {(props) => (
                      <Button
                        radius={"xl"}
                        variant="filled"
                        color={theme.primaryColor}
                        {...props}
                        rightIcon={<IconUpload size={16} color={theme.white} stroke={1.5} />}
                      >
                        Receipt
                      </Button>
                    )}
                  </FileButton>
                </div>
              </Flex>

              <TextInput
                required
                withAsterisk={false}
                label="Name"
                name="expenseName"
                id="expenseName"
                value={form.values.expenseName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={
                  form.errors.expenseName && form.touched.expenseName
                    ? `${form.errors.expenseName}`
                    : null
                }
              />
              <Group grow align="flex-start">
                <TextInput
                  required
                  withAsterisk={false}
                  label="Type"
                  name="expenseType"
                  id="expenseType"
                  value={form.values.expenseType}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={
                    form.errors.expenseType && form.touched.expenseType
                      ? `${form.errors.expenseType}`
                      : null
                  }
                />
                <TextInput
                  required
                  withAsterisk={false}
                  label="Amount"
                  name="expensePrice.amount"
                  id="expensePrice.amount"
                  type="number"
                  value={form.values.expensePrice?.amount}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  rightSectionWidth={rem(88)}
                  rightSection={
                    <Select
                      required
                      withAsterisk={false}
                      searchable
                      radius={"xl"}
                      variant="unstyled"
                      nothingFound="No such currency"
                      value={form.values.expensePrice?.currency}
                      onChange={handleOnChangeValueCurrency}
                      data={currencyList}
                    />
                  }
                  error={
                    form.errors.meetingPlace && form.touched.meetingPlace
                      ? `${form.errors.meetingPlace}`
                      : null
                  }
                />
              </Group>

              <Group align="flex-end" position="right" mt={rem(32)}>
                <Button variant="outline" onClick={handleCancel} size="xs">
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  onClick={() => form.handleSubmit()}
                  size="xs"
                  loading={isCreating}
                >
                  Save
                </Button>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export { _AddFollowUpModal };

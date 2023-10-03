import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Divider,
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
  useAppSelector,
} from "@store";
import { YYYY_MM_DD_HH_MM_SS_A } from "@constants";
import { IconUpload } from "@tabler/icons-react";
import { useGStyles } from "../../../../../styles";
import { notify } from "@utility";

interface OwnProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

interface IFollowUpForm extends Omit<IFollowUp, "id"> {}

const _AddFollowUpModal: React.FC<OwnProps> = ({ title, opened, onClose }) => {
  const { theme } = useStyles();
  const { classes: gclasses } = useGStyles();
  const {
    state: { user },
  } = useAuthContext();
  const projects = useAppSelector(selectProjectWithRecords);
  const { projects: projectsList } = useAppSelector(selectRecordsForDropdown);
  const contacts = useAppSelector(selectCompanyContact);
  const [contactList, setContactList] = React.useState<IDropDownList>([]);

  const form = useFormik<IFollowUpForm>({
    initialValues: {
      contactPersonId: 0,
      projectId: 0,
      followUpPersonId: user!.id,
      meetingDate: DateTime.now().toFormat(YYYY_MM_DD_HH_MM_SS_A),
      meetingPlace: "",
      address: "",
      city: "",
      state: "",
      country: "",
      meetingAgenda: "",
      meetingSummary: "",
      nextFollowUp: {
        place: "",
        meetingDate: DateTime.now().toFormat(YYYY_MM_DD_HH_MM_SS_A),
        meetingAgenda: "",
      },
      expenses: {
        name: "",
        type: "",
        amount: {
          amount: 0,
          currency: "MYR",
        },
        receipt: "", //image
      },
    },
    onSubmit(values, helpers) {
      console.log(values);
      //dispatch
      helpers.resetForm();
      onClose();
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
        form.setValues((prev) => ({ ...prev, expenses: { ...prev.expenses, receipt: dataUri } }));
      }
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (!form.values.projectId) return;
    const project = projects.find((project) => project.id === form.values.projectId);
    const compContacts = contacts.data
      .filter((contact) => contact.companyId === project?.companyId)
      .map((contact) => ({
        label: contact.name,
        value: contact.id.toString(),
      }));
    setContactList(compContacts);
  }, [contacts.data, form.values.projectId, projects]);

  return (
    <Modal
      // size="xl"
      fullScreen
      withinPortal
      withOverlay
      title={title}
      opened={opened}
      onClose={onClose}
      overlayProps={modalOverlayPropsHelper(theme)}
    >
      <Grid columns={25}>
        <Grid.Col span={12}>
          <Stack spacing={"xs"}>
            <Group grow align="flex-start">
              <Select
                required
                searchable
                withAsterisk={false}
                label="Lead/Project"
                placeholder="Select a project"
                allowDeselect={false}
                nothingFound="No projects found"
                value={form.values.projectId.toString()}
                onChange={(value) => {
                  if (!value) return;
                  form.setValues((prev) => ({ ...prev, projectId: parseInt(value) }));
                }}
                data={projectsList}
              />
              <Select
                required
                searchable
                withAsterisk={false}
                label="Meeting With"
                placeholder="Select contact"
                allowDeselect={false}
                nothingFound="No contacts found"
                value={form.values.contactPersonId.toString()}
                onChange={(value) => {
                  if (!value) return;
                  form.setValues((prev) => ({ ...prev, contactPersonId: parseInt(value) }));
                }}
                data={contactList}
              />
            </Group>
            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Meeting Date/Time"
                name="meetingDate"
                id="meetingDate"
                value={form.values.meetingDate}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
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
            />
            <Textarea
              rows={5}
              label="Summary"
              name="meetingSummary"
              id="meetingSummary"
              value={form.values.meetingSummary}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            <Divider
              label={
                <>
                  <Text size={"sm"}>Next Visit</Text>
                </>
              }
              labelPosition={"center"}
              size={"sm"}
              labelProps={{ color: "gray" }}
            />
            <Group grow align="flex-start">
              <TextInput
                required
                withAsterisk={false}
                label="Place"
                name="nextFollowUp.place"
                id="nextFollowUp.place"
                value={form.values.nextFollowUp.place}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <TextInput
                required
                withAsterisk={false}
                label="Date/Time"
                name="nextFollowUp.meetingDate"
                id="nextFollowUp.meetingDate"
                value={form.values.nextFollowUp.meetingDate}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={1} />
        <Grid.Col span={12}>
          <Stack spacing={"xs"}>
            <Textarea
              rows={5}
              label="Agenda"
              name="nextFollowUp.meetingAgenda"
              id="nextFollowUp.meetingAgenda"
              value={form.values.nextFollowUp.meetingAgenda}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            <Divider
              label={
                <>
                  <Text size={"sm"}>Expense / Claim</Text>
                </>
              }
              labelPosition={"center"}
              size={"sm"}
              labelProps={{ color: "gray" }}
            />
            <Flex direction={"column"} align={"center"} justify={"flex-end"}>
              {form.values.expenses.receipt ? (
                <Avatar src={form.values.expenses.receipt} radius={"md"} size={rem(170)} />
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
              label="Type"
              name="expenses.type"
              id="expenses.type"
              value={form.values.expenses.type}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export { _AddFollowUpModal };

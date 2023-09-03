import React from "react";
import { useStyles } from "./styles";
import {
  Avatar,
  Button,
  Center,
  Flex,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useGStyles } from "../../../styles";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useAppSelector } from "@store";
import { colors } from "@theme";
import {
  GridColumn,
  GridCellKind,
  Item,
  GridCell,
  GridSelection,
} from "@glideapps/glide-data-grid";
import { DataEditor, CompactSelection } from "@glideapps/glide-data-grid";
import { _AddCompanyModal } from "../components";

interface OwnProps {}

const Company: React.FC<OwnProps> = () => {
  useStyles();
  const { classes: gclasses, theme } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data } = useAppSelector((state) => state.companies);
  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<ICompany[]>([]);
  const [selection, setSelection] = React.useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  console.log(selection);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    data.filter((company) => company.name.includes(query));
  };

  React.useEffect(() => {
    setSearchedData(data);
  }, [data]);

  const rows =
    data.length === 0 ? (
      <Center>
        <Text color={colors.titleText}>No Companies</Text>
      </Center>
    ) : (
      <>
        {data.map((company, index) => (
          <tr key={company.id}>
            <td>{index + 1}</td>
            <td>
              <Avatar src={company.logo} size={50} />
            </td>
            <td>{company.id}</td>
            <td>{company.name}</td>
            <td>{company.contact.name}</td>
            <td>{company.contact.designation}</td>
            <td>{company.contact.email}</td>
            <td>{company.contact.phone}</td>
            <td>{company.name}</td>
          </tr>
        ))}
      </>
    );

  const columns: GridColumn[] = [
    { title: "Logo", id: "logo", group: "Company", width: 100 },
    { title: "Id", id: "id", group: "Company" },
    { title: "Name", id: "name", group: "Company" },
    { title: "Contact Person", id: "contact.name", group: "Contact Person" },
    { title: "Designation", id: "contact.designation", group: "Contact Person" },
    { title: "Email", id: "contact.email", group: "Contact Person" },
    { title: "Phone", id: "contact.phone", group: "Contact Person" },
    { title: "Company Email", id: "email", group: "Company" },
    { title: "Company Phone", id: "phone", group: "Company" },
    { title: "Address", id: "address", group: "Company" },
    { title: "City", id: "city", group: "Company" },
    { title: "Country", id: "country", group: "Company" },
  ];

  function getData([col, row]: Item): GridCell {
    const dataRow = searchedData[row];
    console.log(col, row);

    const indexes = [
      "logo",
      "id",
      "name",
      "contact.name",
      "contact.designation",
      "contact.email",
      "contact.phone",
      "email",
      "phone",
      "address",
      "city",
      "country",
    ];
    const d = indexes[col];
    const nestedKeys: Record<number, string> = {
      3: "name",
      4: "designation",
      5: "email",
      6: "phone",
    };

    if (col === 0) {
      return {
        kind: GridCellKind.Image,
        allowAdd: true,
        data: [dataRow.logo],
        allowOverlay: false,
        displayData: [dataRow.logo],
      };
    } else if (Object.keys(nestedKeys).includes(col.toString())) {
      const key = nestedKeys[col];
      return {
        kind: GridCellKind.Text,
        // @ts-expect-error key
        data: dataRow.contact[key],
        allowOverlay: false,
        // @ts-expect-error key
        displayData: dataRow.contact[key],
      };
    } else {
      return {
        kind: GridCellKind.Text,
        // @ts-expect-error key
        data: dataRow[d].toString(),
        allowOverlay: false,
        // @ts-expect-error key
        displayData: dataRow[d].toString(),
      };
    }
  }

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
        <Button
          variant="filled"
          rightIcon={<IconPlus size={16} />}
          onClick={() => setAddCompanyModalOpened(true)}
        >
          Company
        </Button>
      </Flex>
      <ScrollArea type="scroll" h={{ md: "98vh" }}>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Logo</th>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <DataEditor
        theme={{
          accentFg: theme.white,
          accentColor: theme.colors[theme.primaryColor][6],
          accentLight: theme.colors[theme.primaryColor][0],
          bgCell: theme.white,
          bgHeader: theme.white,
          borderColor: colors.thinGray,
        }}
        freezeColumns={3}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        rowMarkers="both"
        getCellContent={getData}
        columns={columns}
        rows={searchedData.length}
        width={"100%"}
        height={"80vh"}
        smoothScrollX
        smoothScrollY
      />
      <_AddCompanyModal
        title="Add Company"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      />
    </Stack>
  );
};

export { Company };

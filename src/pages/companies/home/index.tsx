import React from "react";
import { useStyles } from "./styles";
import { Button, Center, Flex, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { useGStyles } from "../../../styles";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useAppSelector } from "@store";
import { colors } from "@theme";
import { _AddCompanyModal } from "../components";

interface OwnProps {}

const Company: React.FC<OwnProps> = () => {
  useStyles();
  const { classes: gclasses } = useGStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data } = useAppSelector((state) => state.companies);
  const [addCompanyModalOpened, setAddCompanyModalOpened] = React.useState(false);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const rows =
    data.length === 0 ? (
      <Center>
        <Text color={colors.titleText}>No Companies</Text>
      </Center>
    ) : (
      <>
        {data.map((company) => (
          <div key={company.id}>{company.name}</div>
        ))}
      </>
    );

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
        {rows}
      </ScrollArea>
      <_AddCompanyModal
        title="Add Company"
        opened={addCompanyModalOpened}
        onClose={() => setAddCompanyModalOpened(false)}
      />
    </Stack>
  );
};

export { Company };

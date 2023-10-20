import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, ScrollArea, Stack, Text, TextInput, rem } from "@mantine/core";
import { colors } from "@theme";
import { selectExpenseTypeList, useAppSelector } from "@store";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { _AddExpenseTypeModal, _ExpenseTypeCard } from "./components";

interface OwnProps {}

export const ExpenseTypes: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR },
  } = useAuthContext();
  const { classes: gclasses } = useGStyles();
  const { data: expenseTypes } = useAppSelector(selectExpenseTypeList);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addExpenseTypeModalOpened, setAddExpenseTypeModalOpened] = React.useState(false);
  const [editExpenseTypeModalOpened, setEditExpenseTypeModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof expenseTypes>([]);
  const [selectedExpenseType, setSelectedExpenseType] = React.useState<IExpenseType>(
    {} as IExpenseType
  );

  const handleEditSupplier = React.useCallback((type: IExpenseType) => {
    setSelectedExpenseType(type);
    setEditExpenseTypeModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin || isHR) {
      const filtered = expenseTypes.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    if (isAdmin || isHR) {
      setSearchedData(expenseTypes);
    }
  }, [isAdmin, isHR, expenseTypes]);

  const rows =
    searchedData.length === 0 ? (
      <center>
        <Text color={colors.titleText} align="center">
          No Expense types...
        </Text>
      </center>
    ) : (
      <>
        {searchedData.map((supplier) => {
          return (
            <_ExpenseTypeCard key={supplier._id} item={supplier} setForEdit={handleEditSupplier} />
          );
        })}
      </>
    );
  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} color={colors.titleText}>
          Expense Types
        </Text>
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
          {isAdmin && (
            <Button
              variant="filled"
              rightIcon={<IconPlus size={16} />}
              onClick={() => setAddExpenseTypeModalOpened(true)}
            >
              Expense Type
            </Button>
          )}
        </Flex>
        <ScrollArea type="scroll" h={"72vh"}>
          {rows}
        </ScrollArea>
        <_AddExpenseTypeModal
          mode="add"
          title="Add Expense Type"
          record={undefined}
          opened={addExpenseTypeModalOpened}
          onClose={() => setAddExpenseTypeModalOpened(false)}
        />
        <_AddExpenseTypeModal
          mode="edit"
          title="Update Expense Type"
          record={selectedExpenseType}
          opened={editExpenseTypeModalOpened}
          onClose={() => setEditExpenseTypeModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default ExpenseTypes;

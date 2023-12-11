import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, ScrollArea, Stack, Text, TextInput, rem } from "@mantine/core";
import { colors } from "@theme";
import { selectPurchaseCategories, useAppSelector } from "@store";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { _AddCategoryModal, _CategoryCard } from "./components";

interface OwnProps {}

export const PurchaseCategories: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin },
  } = useAuthContext();
  const { classes: gclasses } = useGStyles();
  const { data: categories } = useAppSelector(selectPurchaseCategories);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addCategoryModalOpened, setAddCategoryModalOpened] = React.useState(false);
  const [editCategoryModalOpened, setEditCategoryModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof categories>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<IPurchaseCategory>(
    {} as IPurchaseCategory
  );

  const handleEditSupplier = React.useCallback((type: IPurchaseCategory) => {
    setSelectedCategory(type);
    setEditCategoryModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = categories.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(categories);
  }, [categories]);

  const rows =
    searchedData.length === 0 ? (
      <center>
        <Text color={colors.titleText} align="center">
          No Purchase categories
        </Text>
      </center>
    ) : (
      <>
        {searchedData.map((supplier) => {
          return (
            <_CategoryCard key={supplier._id} item={supplier} setForEdit={handleEditSupplier} />
          );
        })}
      </>
    );

  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} m={"xs"} color={colors.titleText}>
          Purchase Categories
        </Text>
        <Flex gap={"md"} m={"xs"} className={gclasses.searchContainer}>
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
              onClick={() => setAddCategoryModalOpened(true)}
            >
              Category
            </Button>
          )}
        </Flex>
        <ScrollArea type="scroll" h={"72vh"}>
          {rows}
        </ScrollArea>
        <_AddCategoryModal
          mode="add"
          title="Add Category"
          record={undefined}
          opened={addCategoryModalOpened}
          onClose={() => setAddCategoryModalOpened(false)}
        />
        <_AddCategoryModal
          mode="edit"
          title="Update Category"
          record={selectedCategory}
          opened={editCategoryModalOpened}
          onClose={() => setEditCategoryModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default PurchaseCategories;

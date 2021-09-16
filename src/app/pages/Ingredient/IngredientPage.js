import React from "react";
import axios from "axios";
import { Tabs, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import InventoryTab from "./InventoryTab/InventoryTab";
import CategoryTab from "./CategoryTab/CategoryTab";
import UnitTab from "./UnitTab/UnitTab";
import UnitConversionTab from "./UnitConversionTab/UnitConversionTab";
import RecipeTab from "./RecipeTab/RecipePage";

export const IngredientPage = () => {
  const { t } = useTranslation();
  const [tabs, setTabs] = React.useState("raw-material");
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);
  const [allMaterials, setAllMaterials] = React.useState([]);

  const [recipeTab, setRecipeTab] = React.useState("");

  const [refresh, setRefresh] = React.useState(0);
  const handleRefresh = () => setRefresh((state) => state + 1);

  const getOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getMaterial = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/raw-material`);
      console.log("getMaterial", data.data)
      setAllMaterials(data.data);
    } catch (err) {
      setAllMaterials([]);
    }
  };

  const getCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/raw-material-category`
      );
      setAllCategories(data.data);
    } catch (err) {
      setAllCategories([]);
    }
  };

  const getUnits = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/unit`);
      setAllUnits(data.data);
    } catch (err) {
      setAllUnits([]);
    }
  };

  const handleTypeBusiness = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("user_info"));

      let nameRecipeTab;
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/business/${localData.business_id}`
      );
      if (data.data.business_type_id == 1) nameRecipeTab = "assembly";
      if (data.data.business_type_id == 2) nameRecipeTab = "recipe";
      if (data.data.business_type_id == 3) nameRecipeTab = "assembly";

      console.log("nameRecipeTab", nameRecipeTab);

      setRecipeTab(nameRecipeTab);

      console.log();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getCategories();
    getUnits();
  }, [refresh]);

  React.useEffect(() => {
    getOutlet();
    getMaterial();
    handleTypeBusiness();
  }, []);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="raw-material" title={t("rawMaterial")}>
        <InventoryTab
          allOutlets={allOutlets}
          allCategories={allCategories}
          allUnits={allUnits}
          refresh={refresh}
          handleRefresh={handleRefresh}
          t={t}
        />
      </Tab>

      <Tab eventKey="recipe" title={t(recipeTab)}>
        <RecipeTab
          t={t}
          allOutlets={allOutlets}
          allMaterials={allMaterials}
          allUnits={allUnits}
          allCategories={allCategories}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>

      <Tab eventKey="category" title={t("category")}>
        <CategoryTab refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>

      {/* <Tab eventKey="unit" title="Unit">
        <UnitTab refresh={refresh} handleRefresh={handleRefresh} />
      </Tab> */}

      <Tab eventKey="unit-conversion" title={t("unitConvertion")}>
        <UnitConversionTab
          t={t}
          allUnits={allUnits}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>
    </Tabs>
  );
};

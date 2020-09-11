import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";

import ProductTab from "./ProductTab/ProductTab";
import ProductModifierTab from "./ProductModifierTab/ProductModifierTab";
import ProductCategoryTab from "./ProductCategoryTab/ProductCategoryTab";

export const ProductPage = () => {
  const [tabs, setTabs] = React.useState("product");
  const [refresh, setRefresh] = React.useState(0);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [allProductModifiers, setAllProductModifiers] = React.useState([]);

  const getOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const allCategories = await axios.get(
        `${API_URL}/api/v1/product-category`
      );
      setAllCategories(allCategories.data.data);
    } catch (err) {
      setAllCategories([]);
    }
  };

  const getProductModifier = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const modifiers = await axios.get(`${API_URL}/api/v1/group-modifier`);
      setAllProductModifiers(modifiers.data.data);
    } catch (err) {
      setAllProductModifiers([]);
    }
  };

  const handleRefresh = () => {
    setRefresh((state) => state + 1);
  };

  React.useEffect(() => {
    getOutlet();
  }, []);

  React.useEffect(() => {
    getProductCategory();
    getProductModifier();
  }, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="product" title="Product">
        <ProductTab
          allOutlets={allOutlets}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>

      <Tab eventKey="product-modifier" title="Product Modifier">
        <ProductModifierTab
          allOutlets={allOutlets}
          allCategories={allCategories}
          allProductModifiers={allProductModifiers}
          setAllCategories={setAllCategories}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>

      <Tab eventKey="product-category" title="Product Category">
        <ProductCategoryTab
          allOutlets={allOutlets}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>
    </Tabs>
  );
};

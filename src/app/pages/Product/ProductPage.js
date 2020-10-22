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
  const [allProducts, setAllProducts] = React.useState([]);

  const getProduct = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const products = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(products.data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

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

  const handleRefresh = () => {
    setRefresh((state) => state + 1);
  };

  React.useEffect(() => {
    getOutlet();
  }, []);

  React.useEffect(() => {
    getProductCategory();
    // getProduct();
  }, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="product" title="Product">
        <ProductTab
          allOutlets={allOutlets}
          allCategories={allCategories}
          refresh={refresh}
          handleRefresh={handleRefresh}
        />
      </Tab>

      {/* <Tab eventKey="product-modifier" title="Product Modifier">
        <ProductModifierTab
          refresh={refresh}
          handleRefresh={handleRefresh}
          allProducts={allProducts}
        />
      </Tab> */}

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

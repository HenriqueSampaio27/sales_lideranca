import Dashboard from "../src/pages/Dashboard";
import StockManagement from "../src/pages/StockManagement";
import ProductRegistration from "../src/pages/ProductRegistration";
import ClientManagement from "../src/pages/ClientManagement";
import Financial from "../src/pages/FinanceManagement";
import POSTerminal from "../src/pages/POSTerminal";
import { ComponentType } from "react";
import Duplicate from "../src/pages/Duplicate";
import Expenses from "../src/pages/Expenses";

type AppRoute = {
  path: string;
  component: ComponentType;
  adminOnly?: boolean;
};

export const appRoutes: AppRoute[] = [
  { path: "/dashboard", component: Dashboard, adminOnly: false },
  { path: "/stock", component: StockManagement},
  { path: "/registration", component: ProductRegistration},
  { path: "/clients", component: ClientManagement},
  { path: "/financial", component: Financial },
  { path: "/pos", component: POSTerminal },
  { path: "/duplicate", component: Duplicate},
  { path: "/expenses", component: Expenses},
];

import Dashboard from "../pages/Dashboard";
import StockManagement from "../pages/StockManagement";
import ProductRegistration from "../pages/ProductRegistration";
import ClientManagement from "../pages/ClientManagement";

import Financial from "../pages/FinanceManagement";
import POSTerminal from "../pages/POSTerminal";
import { ComponentType } from "react";
import Duplicate from "@/pages/Duplicate";

type AppRoute = {
  path: string;
  component: ComponentType;
};

export const appRoutes: AppRoute[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/stock", component: StockManagement},
  { path: "/registration", component: ProductRegistration},
  { path: "/clients", component: ClientManagement},
  { path: "/financial", component: Financial },
  { path: "/pos", component: POSTerminal },
  { path: "/duplicate", component: Duplicate}
];

import {Page} from "./pages"

export interface SidebarProps {
  currentPage?: Page;
  onPageChange?: (page: Page) => void;
}

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

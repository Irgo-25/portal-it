import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Building2,
    Cog,
    Folder,
    LayoutGrid,
    Ruler,
    StickyNote,
    User2Icon,
    UserCircle,
    Warehouse,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import categories from '@/routes/categories';
import departements from '@/routes/departements';
import uoms from '@/routes/uoms';
import users from '@/routes/users';
import type {
    NavItem,
    UserMenuItem,
    MasterDataMenuItem,
    StockMenuItem,
} from '@/types';
import { NavMasterData } from './nav-master-data';
import { NavStock } from './nav-stock';
import { NavUserManagement } from './nav-user-management';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const mainNavUserManagementItems: UserMenuItem[] = [
    {
        title: 'Users Management',
        icon: UserCircle,
        items: [
            {
                title: 'All Users',
                href: users.index(),
                icon: User2Icon,
            },
        ],
    },
];
const mainMasterDataItems: MasterDataMenuItem[] = [
    {
        title: 'Master Data',
        icon: Cog,
        items: [
            {
                title: 'Departement',
                href: departements.index(),
                icon: Building2,
            },
            {
                title: 'Category',
                href: categories.index(),
                icon: Folder,
            },
            {
                title: 'Unit of Measurement',
                href: uoms.index(),
                icon: Ruler,
            },
        ],
    },
];

const mainMenuItems: StockMenuItem[] = [
    {
        title: 'Stock Management',
        icon: Warehouse,
        items: [
            {
                title: 'Stock Items',
                href: '#',
                icon: StickyNote,
            },
            {
                title: 'Stock Movement',
                href: '#',
                icon: ArrowLeftRight,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavStock items={mainMenuItems} />
                <NavMasterData items={mainMasterDataItems} />
                <NavUserManagement items={mainNavUserManagementItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

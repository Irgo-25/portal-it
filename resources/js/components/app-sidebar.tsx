import { Link } from '@inertiajs/react';
import {
    Building2,
    Cog,
    LayoutGrid,
    ShieldCloseIcon,
    User2Icon,
    UserCircle,
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
import departements from '@/routes/departements';
import users from '@/routes/users';
import type { NavItem, UserMenuItem, MasterDataMenuItem } from '@/types';
import { NavMasterData } from './nav-master-data';
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
            {
                title: 'Roles',
                href: '/roles',
                icon: ShieldCloseIcon,
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
                <NavUserManagement items={mainNavUserManagementItems} />
                <NavMasterData items={mainMasterDataItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

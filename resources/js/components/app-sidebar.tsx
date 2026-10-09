import { Link, usePage } from "@inertiajs/react";
import {
    CalendarDays,
    CircleHelp,
    LayoutDashboard,
    Trophy,
    Users,
    MapPin,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { NavItem } from "@/types";

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: string | null;
};

type PageProps = {
    auth: {
        user: AuthUser | null;
    };
};

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Bookings",
        href: "/booking",
        icon: CalendarDays,
    },
    {
        title: "Support",
        href: "/support/inbox",
        icon: CircleHelp,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Tournaments",
        href: "/admin/tournaments",
        icon: Trophy,
    },
    // {
    //     title: "Courts",
    //     href: "/admin/courts",
    //     icon: MapPin,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const isAdmin = auth.user?.role === "admin";

    // Only admins should see the admin navigation.
    if (!isAdmin) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Logo */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* User */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

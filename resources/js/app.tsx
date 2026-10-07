import { createInertiaApp } from "@inertiajs/react";
import type { ComponentType } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeTheme } from "@/hooks/use-appearance";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import SettingsLayout from "@/layouts/settings/layout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const pages = import.meta.glob("./pages/**/*.tsx", {
    eager: true,
}) as Record<string, { default: ComponentType<any> }>;

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page;
    },

    layout: (name) => {
        switch (true) {
            case name === "court_avenue/index":
                return null;

            case name.startsWith("court_avenue/booking/"):
                return null;

            case name.startsWith("auth/"):
                return AuthLayout;

            case name.startsWith("settings/"):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: "#4B5563",
    },
});

initializeTheme();

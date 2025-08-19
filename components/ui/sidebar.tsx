"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer"
import { useGlobalState } from "@/contexts/GlobalStateContext"

const menuItemsChecksheet = [
    {
        name: "Dashboard",
        icon: "/icons/dashboard.svg",
        href: "/maintenance"
    },
    {
        name: "Component",
        icon: "/icons/component.svg",
        href: "/maintenance/services"
    },
    {
        name: "History",
        icon: "/icons/history.svg",
        href: "/history"
    },
]

const menuItemsMaintenance = [
    {
        name: "Dashboard",
        icon: "/icons/dashboard.svg",
        href: "/checksheet"
    },
    {
        name: "History",
        icon: "/icons/history.svg",
        href: "/history"
    },
]

export function Sidebar() {
    const { method } = useGlobalState();
    const pathname = usePathname();
    const menuItems = method === 'maintenance' ? menuItemsMaintenance : menuItemsChecksheet;

    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <button className="p-2">
                    <Image src="/images/menu.svg" alt="Menu" width={26} height={26} />
                </button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[280px] rounded-none">
                <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
                <div className="flex h-full flex-col bg-primary p-4">
                    {/* Logo */}
                    <div className="flex p-4">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto"
                        />
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                                    pathname.startsWith(item.href)
                                        ? "text-white/70"
                                        : "text-white"
                                )}
                            >
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={20}
                                        height={20}
                                        className="h-5 w-5"
                                    />
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="mt-auto border-t border-gray-200 pt-4">
                        <Link
                            key={'logout'}
                            href={'/'}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors text-white"
                        >
                            <div className="flex h-8 w-8 items-center justify-center">
                                <Image
                                    src={'/icons/logout.svg'}
                                    alt={'Logout'}
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                            </div>
                            <span className="font-medium">Logout</span>
                        </Link>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

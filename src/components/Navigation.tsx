import { HiCog, HiLogout, HiMenu } from "react-icons/hi";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navigation() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">The Story Nexus</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                        >
                            <a href="/settings/ai" className="flex items-center gap-2">
                                <HiCog className="h-4 w-4" />
                                AI Settings
                            </a>
                        </Button>
                        <form action="/api/auth/signout" method="POST">
                            <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <HiLogout className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <HiMenu className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a href="/settings/ai" className="flex items-center">
                                        <HiCog className="mr-2 h-4 w-4" />
                                        <span>AI Settings</span>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <form action="/api/auth/signout" method="POST" className="w-full">
                                        <button type="submit" className="flex w-full items-center">
                                            <HiLogout className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

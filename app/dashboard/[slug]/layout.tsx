import Link from "next/link"
import { Home, LayoutDashboard, LineChart, CandlestickChart } from 'lucide-react';
import Logo from "@/components/Logo";

const sidebarItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: LineChart, label: 'Analysis', href: '/eur-usd/analysis' },
    { icon: CandlestickChart, label: 'Indicators', href: '/eur-usd/indicators' },
];

export default function DashboardLayout({
    children, // will be a page or nested layout
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-16 min-h-screen bg-card border-r flex flex-col items-center py-6 gap-8">
                <Link 
                    href="/"    
                    className="w-10 h-10"
                >
                    <Logo />
                </Link>
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}
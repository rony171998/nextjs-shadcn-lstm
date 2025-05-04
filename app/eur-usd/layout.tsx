import Link from "next/link"
import { BarChart3, Mail, Package, Settings, Store } from 'lucide-react';

const sidebarItems = [
    { icon: Store, label: 'Home', href: '/' },
    { icon: BarChart3, label: 'Indicadores', href: '/eur-usd/indicators' },
    { icon: Mail, label: 'Email', href: '/email' },
    { icon: Package, label: 'Design', href: '/design' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-16 min-h-screen bg-card border-r flex flex-col items-center py-4 gap-6">
                <div className="w-8 h-8 bg-primary rounded-lg mb-4"></div>
                {sidebarItems.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" />
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
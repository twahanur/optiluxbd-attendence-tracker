import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/service/auth";

const CommonLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userInfo = await getCurrentUser();

  return (
    <section className="px-10 py-4">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 52)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" role={userInfo?.role} />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
};

export default CommonLayout;

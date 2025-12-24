import HomePage from "@/component/home/HomePage";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GetStatistics } from "@/service/admin";

const Home = async () => {
  const res = await GetStatistics();
  console.log(res);
  return (
    <section className="px-10 py-4">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <HomePage />
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
};

export default Home;

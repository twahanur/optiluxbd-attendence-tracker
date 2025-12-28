import HomePage from "@/component/home/HomePage";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GetStatistics } from "@/service/admin/statistics";

const Home = async () => {
  const res = await GetStatistics();
  console.log(res);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="px-6 py-4">
          <HomePage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;

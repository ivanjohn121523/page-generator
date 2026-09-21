import SiteEditor from "../../components/SiteEditor";

export default async function SitePage({
  params,
}: PageProps<"/dashboard/sites/[siteId]">) {
  const { siteId } = await params;
  return <SiteEditor siteId={siteId} />;
}

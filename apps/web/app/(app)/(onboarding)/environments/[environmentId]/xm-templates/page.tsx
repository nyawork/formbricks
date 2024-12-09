import { XMTemplateList } from "@/app/(app)/(onboarding)/environments/[environmentId]/xm-templates/components/XMTemplateList";
import { getOrganizationIdFromEnvironmentId } from "@/lib/utils/helper";
import { XIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@formbricks/lib/authOptions";
import { getEnvironment } from "@formbricks/lib/environment/service";
import { getProductByEnvironmentId, getUserProducts } from "@formbricks/lib/product/service";
import { getUser } from "@formbricks/lib/user/service";
import { Button } from "@formbricks/ui/components/Button";
import { Header } from "@formbricks/ui/components/Header";

interface XMTemplatePageProps {
  params: Promise<{
    environmentId: string;
  }>;
}

const Page = async (props: XMTemplatePageProps) => {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const environment = await getEnvironment(params.environmentId);
  const t = await getTranslations();
  if (!session) {
    throw new Error(t("common.session_not_found"));
  }

  const user = await getUser(session.user.id);
  if (!user) {
    throw new Error(t("common.user_not_found"));
  }
  if (!environment) {
    throw new Error(t("common.environment_not_found"));
  }

  const organizationId = await getOrganizationIdFromEnvironmentId(environment.id);

  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error(t("common.product_not_found"));
  }

  const products = await getUserProducts(session.user.id, organizationId);

  return (
    <div className="flex min-h-full min-w-full flex-col items-center justify-center space-y-12">
      <Header title={t("environments.xm-templates.headline")} />
      <XMTemplateList product={product} user={user} environmentId={environment.id} />
      {products.length >= 2 && (
        <Button
          className="absolute right-5 top-5 !mt-0 text-slate-500 hover:text-slate-700"
          variant="minimal"
          href={`/environments/${environment.id}/surveys`}>
          <XIcon className="h-7 w-7" strokeWidth={1.5} />
        </Button>
      )}
    </div>
  );
};

export default Page;
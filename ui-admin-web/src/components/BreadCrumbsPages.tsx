import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export interface Breadcrumb {
  path: string;
  label: string;
  isCurrentPath?: boolean;
}

interface BreadCrumbsPagesProps {
  breadCrums: Breadcrumb[];
}

export default function BreadCrumbsPages({
  breadCrums,
}: BreadCrumbsPagesProps) {
  const locale = useLocale()
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrums?.map((item,index) => (
          <>
            <BreadcrumbItem key={item.path}>
              <BreadcrumbLink className={cn(item.isCurrentPath && 'text-primary')} href={`/${locale}${item.path}`}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {breadCrums?.length - 1 !== index && (<BreadcrumbSeparator/>)}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

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
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrums?.map((item,index) => (
          <>
            <BreadcrumbItem key={item.path}>
              <BreadcrumbLink className={cn(item.isCurrentPath && 'text-primary')} href={item.path}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {breadCrums?.length - 1 !== index && (<BreadcrumbSeparator/>)}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

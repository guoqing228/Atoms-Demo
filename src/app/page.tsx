import { TooltipProvider } from "@/components/ui/tooltip";
import { Workspace } from "@/components/workspace/workspace";

export default function Home() {
  return (
    <TooltipProvider delayDuration={250}>
      <Workspace />
    </TooltipProvider>
  );
}

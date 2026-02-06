import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Rotate from "@/components/svgs/Rotate";

const Editor = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-muted font-roboto-mono mt-18 w-full text-justify text-[32px] leading-normal font-medium">
        over these at line thing order the get place like since stand open on
        each time give over play would people too most when late tell follow any
        against by will use govern through that might
      </div>
      <Tooltip>
        <TooltipTrigger>
          <Rotate />
        </TooltipTrigger>
        <TooltipContent className="bg-muted text-muted-foreground rounded-sm">
          <p>Restart</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Editor;

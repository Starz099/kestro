import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Rotate from "@/components/svgs/Rotate";

const Editor = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-muted-foreground mt-20 w-full rounded-sm border-2 p-4 text-justify font-mono text-3xl leading-normal">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, quas
        doloribus? Doloremque nesciunt unde hic similique iusto possimus labore
        fuga accusantium, enim a ex quod quos odio nulla, voluptas atque.
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

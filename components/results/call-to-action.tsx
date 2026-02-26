import { SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const CallToAction = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="ghost" className="cursor-pointer shadow-md">
            Signin to save your results in future
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export default CallToAction;

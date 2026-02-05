import SettingsPanel from "@/components/settings-panel";

const Page = () => {
  return (
    <div className="h-screen w-screen p-4">
      <div className="font-press-start-2p text-primary h-full w-full border-2 p-4">
        <div className="text-4xl">Kestro</div>
        <SettingsPanel />
      </div>
    </div>
  );
};

export default Page;

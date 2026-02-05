import Editor from "@/components/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";

const Page = () => {
  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <div className="">
        <Navbar />
        <div className="mt-6">
          <SettingsPanel />
        </div>
        <Editor />
      </div>
      <Footer />
    </div>
  );
};

export default Page;

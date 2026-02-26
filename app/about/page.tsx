import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const Page = () => {
  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <Navbar />
      <div className="no-scrollbar my-8 h-full w-full overflow-y-auto text-justify">
        <div className="text-muted-foreground mx-auto flex w-5/6 max-w-4xl flex-col gap-10 text-base leading-relaxed">
          <section className="flex flex-col gap-3 text-left">
            <p className="text-primary text-center text-2xl tracking-[0.25em] uppercase">
              About
            </p>

            <p>
              Kestro is a keyboard-first practice platform for developers to
              master text editing speed and precision.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-primary text-lg font-semibold">
              What it trains
            </h2>
            <p>
              Train normal typing, code editing, and Vim-style motions through
              structured challenges, real code tasks, and competitive races.
            </p>
            <p>
              Kestro is built to grow real muscle memory, not just typing speed.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-primary text-lg font-semibold">Support</h2>
            <p>
              Found a bug or have a feature idea? Share feedback and help shape
              the next version of Kestro on GitHub.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;

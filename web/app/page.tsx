"use client";

import { useCallback, useState } from "react";
import Editor from "@/components/editor/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";
import { generateWordSequence } from "@/lib/word-generator";

const WORD_SEQUENCE_LENGTH = 700;

const Page = () => {
  const [words, setWords] = useState(() =>
    generateWordSequence(WORD_SEQUENCE_LENGTH),
  );

  const regenerateWords = useCallback(() => {
    setWords(generateWordSequence(WORD_SEQUENCE_LENGTH));
  }, []);

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <Navbar onKeyboardClick={regenerateWords} />
      <div className="mb-24">
        <SettingsPanel />
        <Editor words={words} />
      </div>
      <Footer />
    </div>
  );
};

export default Page;

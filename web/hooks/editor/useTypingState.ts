import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CompletedWord } from "../../types/editor";

type TypingState = {
  currentWordIndex: number;
  currentInput: string;
  completedWords: CompletedWord[];
  setCurrentWordIndex: Dispatch<SetStateAction<number>>;
  setCurrentInput: Dispatch<SetStateAction<string>>;
  setCompletedWords: Dispatch<SetStateAction<CompletedWord[]>>;
};

export const useTypingState = (words: string[]): TypingState => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (currentInput.trim().length > 0) {
          const isCorrect = currentInput.trim() === words[currentWordIndex];
          setCompletedWords([
            ...completedWords,
            { word: currentInput.trim(), isCorrect },
          ]);
          setCurrentWordIndex(currentWordIndex + 1);
          setCurrentInput("");
        }
      } else if (e.key === "Backspace") {
        e.preventDefault();
        if (currentInput.length > 0) {
          setCurrentInput(currentInput.slice(0, -1));
        } else if (completedWords.length > 0) {
          const lastWordObj = completedWords[completedWords.length - 1];
          setCompletedWords(completedWords.slice(0, -1));
          setCurrentWordIndex(currentWordIndex - 1);
          setCurrentInput(lastWordObj.word);
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCurrentInput(currentInput + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInput, currentWordIndex, completedWords, words]);

  return {
    currentWordIndex,
    currentInput,
    completedWords,
    setCurrentWordIndex,
    setCurrentInput,
    setCompletedWords,
  };
};

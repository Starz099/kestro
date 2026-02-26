import { CompletedWord } from "@/types/editor";
import type { RefObject } from "react";

type TypingWordProps = {
  word: string;
  index: number;
  currentWordIndex: number;
  currentInput: string;
  completedWords: CompletedWord[];
  charRefs: RefObject<(HTMLSpanElement | null)[][]>;
};

const TypingWord = ({
  word,
  index,
  currentWordIndex,
  currentInput,
  completedWords,
  charRefs,
}: TypingWordProps) => {
  const isCompleted = index < currentWordIndex;
  const isCurrent = index === currentWordIndex;

  if (isCompleted) {
    const completedWord = completedWords[index];
    const colorClass = completedWord.isCorrect
      ? "text-muted-foreground"
      : "text-red-500";
    return (
      <span className={colorClass}>
        {word.split("").map((char, charIndex) => (
          <span
            key={charIndex}
            ref={(el) => {
              if (!charRefs.current[index]) charRefs.current[index] = [];
              charRefs.current[index][charIndex] = el;
            }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  }

  if (isCurrent) {
    return (
      <span>
        {word.split("").map((char, charIndex) => {
          const typedChar = currentInput[charIndex];
          let className = "text-muted";

          if (typedChar !== undefined) {
            className = typedChar === char ? "text-foreground" : "text-red-500";
          }

          return (
            <span
              key={charIndex}
              ref={(el) => {
                if (!charRefs.current[index]) charRefs.current[index] = [];
                charRefs.current[index][charIndex] = el;
              }}
              className={className}
            >
              {char}
            </span>
          );
        })}
        {currentInput.length > word.length && (
          <span className="text-red-500">
            {currentInput.slice(word.length)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="text-muted">
      {word.split("").map((char, charIndex) => (
        <span
          key={charIndex}
          ref={(el) => {
            if (!charRefs.current[index]) charRefs.current[index] = [];
            charRefs.current[index][charIndex] = el;
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default TypingWord;

import { memo } from "react";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  date: string;
  // Text mode fields
  wpm?: number;
  accuracy?: number;
  raw?: number;
  consistency?: number;
  // Coding mode fields
  // codingWpm?: number;
  snippetsPerMinute?: number;
  snippetsCompleted?: number;
  durationSeconds?: number;
};

type LeaderboardTableProps = {
  data: LeaderboardEntry[];
  isEmpty: boolean;
  isLoading: boolean;
};

const LeaderboardTable = memo(function LeaderboardTable({
  data,
  isEmpty,
  isLoading,
}: LeaderboardTableProps) {
  // Determine if coding mode based on first entry
  const isCodingMode =
    data.length > 0 &&
    // (data[0].codingWpm !== undefined ||
    data[0].snippetsPerMinute !== undefined;
  return (
    <div className="no-scrollbar mt-8 mb-4 min-h-0 w-full flex-1 overflow-y-auto">
      <div className="no-scrollbar h-full overflow-y-auto border">
        <table className="w-full">
          <thead className="bg-background sticky top-0 z-10">
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Name
              </th>
              {isCodingMode ? (
                <>
                  {/* <th className="px-4 py-3 text-right text-sm font-semibold">
                    Coding WPM
                  </th> */}
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Snippets/min
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Snippets Done
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Time (s)
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    WPM
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Accuracy
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Raw
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Consistency
                  </th>
                </>
              )}
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-b">
                <td
                  colSpan={isCodingMode ? 6 : 8}
                  className="text-muted-foreground px-4 py-10 text-center text-sm"
                >
                  Loading runs...
                </td>
              </tr>
            ) : isEmpty ? (
              <tr className="border-b">
                <td
                  colSpan={isCodingMode ? 6 : 8}
                  className="text-muted-foreground px-4 py-10 text-center text-sm"
                >
                  No runs for this mode yet.
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr
                  key={entry.rank}
                  className="hover:bg-muted/30 border-b transition-colors"
                >
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    {entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                        <span className="text-xs">
                          {entry.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                  </td>
                  {isCodingMode ? (
                    <>
                      {/* <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.codingWpm?.toFixed(2) ?? ""}
                      </td> */}
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.snippetsPerMinute?.toFixed(2) ?? ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.snippetsCompleted ?? ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.durationSeconds ?? ""}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.wpm?.toFixed(2) ?? ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.accuracy?.toFixed(2) ?? ""}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.raw?.toFixed(2) ?? ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {entry.consistency?.toFixed(2) ?? ""}%
                      </td>
                    </>
                  )}
                  <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                    {entry.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default LeaderboardTable;

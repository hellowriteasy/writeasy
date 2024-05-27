import React, { useState, useEffect } from "react";
import { usePDF } from "react-to-pdf";
import { Change, diffChars } from "diff";
import usePdfStore from "@/app/store/usePDFStore";

type Props = {
  originals: string;
  corrected: string;
};

const PDF: React.FC<Props> = ({ originals, corrected }) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [improved, setImproved] = useState<React.ReactElement[]>([]);
  const setStoredFunction = usePdfStore((state) => state.setPdfExportFunction);

  useEffect(() => {
    setStoredFunction(toPDF);
  }, []);

  const compareSentences = (
    original: string,
    corrected: string
  ): React.ReactElement[] => {
    original 
    corrected 

    const diff: Change[] = diffChars(original, corrected);
    const result: React.ReactElement[] = [];

    diff.forEach((part: Change, index: number) => {
      const color: string = part.added
        ? "green"
        : part.removed
        ? "red"
        : "black";
      const backgroundColor = part.added
        ? "#51d80e6d"
        : part.removed
        ? "#f0232366"
        : "";
      const textDecoration = part.added ? "underline" : part.removed ? "" : "";

      const style: React.CSSProperties = {
        color: color,
        backgroundColor,
        textDecoration,
        height: "40px",
        display: "inline-block",
      };
      const span: React.ReactElement = (
        <div key={index} style={style}>
          {part.value}
        </div>
      );
      result.push(span);
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(originals, corrected));
  }, [corrected]);

  return (
    <div className="w-full  relative  z-[-5] bg-black">
      {/* <button
        className="bg-slate-100 border border-slate-500 p-1 text-sm rounded-md"
        onClick={() => toPDF()}
      >
        PDF
      </button> */}
      <div
        className="flex items-center   h-[100vh] flex-col w-full "
        ref={targetRef}
      >
        <div className="w-11/12 ">
          <div className="text">
            {improved.length > 0 ? (
              improved.map((element: React.ReactElement, index: number) => (
                <>{element}</>
              ))
            ) : (
              <div className="p-2">
                <p>your corrected data will be here </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDF;

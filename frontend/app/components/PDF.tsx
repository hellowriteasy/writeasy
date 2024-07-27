import React, { useState, useEffect } from "react";
import { usePDF } from "react-to-pdf";
import usePdfStore from "@/app/store/usePDFStore";
import diff_match_patch from "diff-match-patch";

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
    original;
    corrected;

    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(original, corrected);
    dmp.diff_cleanupSemantic(diff);
    const result: React.ReactElement[] = [];

    diff.forEach((part: any, index: number) => {
      const color: string =
        part[0] === 1 ? "green" : part[0] === -1 ? "red" : "black";
      const backgroundColor =
        part[0] === 1
          ? "rgba(8, 165, 8, 0.2)"
          : part[0] === -1
          ? "rgba(255, 0, 0, 0.202)"
          : "";
      const textDecoration =
        part[0] === 1 ? "underline" : part[0] === -1 ? "" : "";

      const style: React.CSSProperties = {
        color: color,
        backgroundColor,
        textDecoration,
        display: "inline-block",
      };
      const span: React.ReactElement = (
        <p key={index} style={style}>
          {part[1]}
        </p>
      );
      result.push(span);
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(originals, corrected));
  }, [corrected, originals]);
  console.log("improved", improved);
  return (
    <div className="w-full ">
      <div
        className="flex items-center  border  h-[100vh] flex-col w-full "
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

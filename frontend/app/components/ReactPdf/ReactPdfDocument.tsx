import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { diff_match_patch } from "diff-match-patch";

// Create styles
const styles = StyleSheet.create({
  page: { fontSize: 12 },
  section: { margin: 30, fontSize: 12 },
  added: {
    color: "green",
    textDecoration: "underline",
    backgroundColor: "rgba(8, 165, 8, 0.2)",
    marginBottom: 2,
  },
  text: { textAlign: "left", color: "black", marginBottom: 2 },
  removed: {
    color: "red",
    textDecoration: "line-through",
    backgroundColor: "rgba(255, 0, 0, 0.202)",
    marginBottom: 2,
  },
  line: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});

// Create Document Component
const PdfDocument = (props: { originals: string; corrected: string }) => {
  const [improved, setImproved] = useState<React.ReactElement[]>([]);
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
      // result.push(span);
      if (part[0] === 1) {
        result.push(<Text style={styles.added}>{part[1]}</Text>);
      } else if (part[0] === -1) {
        result.push(<Text style={styles.removed}>{part[1]}</Text>);
      } else {
        result.push(<Text style={styles.text}>{part[1]}</Text>);
      }
      console.log(part[0], part[1]);
    });

    return result;
  };
  useEffect(() => {
    setImproved(compareSentences(props.originals, props.corrected));
  }, [props.corrected, props.corrected]);
  console.log(props.corrected, props.originals);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.section, { color: "white" }]}>
          <Text style={styles.line}>
            {improved.length > 0
              ? improved.map((text, index) => <>{text}</>)
              : null}
          </Text>
          <Text style={styles.line}></Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;

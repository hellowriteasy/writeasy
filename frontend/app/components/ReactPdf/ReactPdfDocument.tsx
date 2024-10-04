import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { diff_match_patch } from "diff-match-patch";

// Import your image (ensure it's in a format supported by `Image`)
import LogoImage from "../../../public/notification logo.png"; // Replace with the actual path to a PNG/JPEG image

// Create styles
const styles = StyleSheet.create({
  page: { fontSize: 12 },
  section: { margin: 30, fontSize: 12 },
  added: {
    color: "green",
    textDecoration: "underline",
    backgroundColor: "rgba(8, 165, 8, 0.2)",
    marginBottom: 6,
  },
  text: {
    textAlign: "left",
    color: "black",
    marginBottom: 6,
    fontWeight: "light",
  },
  removed: {
    color: "red",
    textDecoration: "line-through",
    backgroundColor: "rgba(255, 0, 0, 0.202)",
    marginBottom: 6,
  },
  line: { display: "flex", flexDirection: "row", flexWrap: "wrap" },

  // Style for the navbar
  navbar: {
    backgroundColor: "#FCD800", // Yellow background
    padding: 10,
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 150,
  },
});

// Create Document Component
const PdfDocument = (props: { originals: string; corrected: string }) => {
  const [improved, setImproved] = useState<React.ReactElement[]>([]);

  const compareSentences = (
    original: string,
    corrected: string
  ): React.ReactElement[] => {
    if (!original || !corrected) return [];
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(original, corrected);
    dmp.diff_cleanupSemantic(diff);
    const result: React.ReactElement[] = [];

    diff.forEach((part: any, index: number) => {
      if (part[0] === 1) {
        result.push(<Text style={styles.added}>{part[1]}</Text>);
      } else if (part[0] === -1) {
        result.push(<Text style={styles.removed}>{part[1]}</Text>);
      } else {
        result.push(<Text style={styles.text}>{part[1]}</Text>);
      }
    });

    return result;
  };

  useEffect(() => {
    setImproved(compareSentences(props.originals, props.corrected));
  }, [props.corrected, props.corrected]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Navbar Section */}
        <View style={styles.navbar}>
          {/* Add the Image component for the logo */}
          <Image
            style={styles.logo}
            src="https://res.cloudinary.com/onlinecoder/image/upload/v1728024504/yj56urjatyfoko30bz81.png"
          />
        </View>

        {/* Main content section */}
        <View style={[styles.section, { color: "white" }]}>
          <Text style={styles.line}>
            {improved.length > 0
              ? improved.map((text, index) => <>{text}</>)
              : null}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;

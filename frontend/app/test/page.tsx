// PDFComponent.js
"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    display:"flex",
    flexGrow: 1,
  },
  title: {
    fontSize: 23,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 13,
    textAlign: "justify",
  },
  removed: {
    fontSize: 13,
    textDecoration: "line-through",
    color: "red",
    backgroundColor: "#ffb7b7",
  },
  inserted: {
    fontSize: 13,
    textDecoration: "underline",
    color: "green",
    backgroundColor: "#acf7b7",
  },
});

const PDFComponent = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>As it is</Text>
        <Text style={styles.removed}>I am removed</Text>
        <Text style={styles.inserted}>I am inserted</Text>
      </View>
    </Page>
  </Document>
);
const App = () => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <PDFComponent />
    <PDFDownloadLink document={<PDFComponent />} fileName="sample.pdf">
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download now!"
      }
    </PDFDownloadLink>
  </div>
);

export default App;

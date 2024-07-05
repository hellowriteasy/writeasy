import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    marginBottom: 10,
    padding: 10,
  },
  deletedText: {
    textDecoration: "line-through",
    color: "red",
  },
  insertedText: {
    textDecoration: "underline",
    color: "green",
  },
});

type MyDocumentProps = {
  content: React.ReactNode;
};

type ParseHTMLToPDF = (htmlContent: string) => React.ReactNode[];

 export const parseHTMLToPDF: ParseHTMLToPDF = (htmlContent) => {
   const parser = new DOMParser();
   const doc = parser.parseFromString(htmlContent, "text/html");
   const elements: React.ReactNode[] = [];

   let currentText = "";
   let currentStyle: any = null;

   const flushText = () => {
     if (currentText) {
       elements.push(<Text style={currentStyle}>{currentText}</Text>);
       currentText = "";
       currentStyle = null;
     }
   };

   doc.body.childNodes.forEach((node) => {
     if (node.nodeType === Node.TEXT_NODE) {
       currentText += node.textContent;
     } else if (node.nodeType === Node.ELEMENT_NODE) {
       const style = (node as HTMLElement).getAttribute("style") || "";

       if (style.includes("line-through") && style.includes("red")) {
         flushText();
         currentStyle = styles.deletedText;
         currentText = node.textContent || "";
       } else if (style.includes("underline") && style.includes("green")) {
         flushText();
         currentStyle = styles.insertedText;
         currentText = node.textContent || "";
       } else {
         flushText();
         elements.push(<Text>{node.textContent}</Text>);
       }
     }
   });

   flushText();
   return elements;
 };


const MyDocument: React.FC<MyDocumentProps> = ({ content }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>{content}</View>
    </Page>
  </Document>
);

export default MyDocument;

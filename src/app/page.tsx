"use client"

import React, { useState, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { DocumentData, } from "@/app/types"


const MainPage = () => {

  // za osnovne vrednosti sem uporabil api in pdf iz pdf-lib za testiranje
  const [apiUrl, setApiUrl] = useState('https://639335b5ab513e12c50722ff.mockapi.io/job');
  const [pdfUrl, setPdfUrl] = useState('https://pdf-lib.js.org/assets/with_update_sections.pdf');
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocument = async (url: string): Promise<DocumentData[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch API data");
    return response.json();
  };

  // // barvna shema v rgb
  const apiColourChange = (color: string) => {
    const [r, g, b] = color.split(',').map(value => parseFloat(value.trim()) / 255);
    return rgb(r, g, b); // nove bare
  };


  // 
  const modifyPdf = async () => {
    setIsLoading(true);
    try {
      const apiData = await fetchDocument(apiUrl);
      const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      for (const doc of apiData) {
        console.log('API Data:', apiData);
        for (const field of doc.documentField) {
          if (field.fieldType === 'COMBOBOX') {
            const options = field.options.comboboxExtras.options;
            const defaultOption = options[field.options.comboboxExtras.defaultOptionKey];
            const visual = field.options.visualisation;
            const page = pdfDoc.getPage(visual.location.page - 1);

            // vsak COMBOX ima svoj 
            const dropdownFieldName = `dropdown-${field.id || Math.random().toString(36).substring(2, 15)}`;

            // pozicija COMBOXOV
            const x = visual.location.x * page.getWidth();
            const y = visual.location.y * page.getHeight();
            const width = visual.width * page.getWidth();
            const height = visual.height * page.getHeight();


            // dropdon dodamo na pdf
            const dropdownField = form.createDropdown(dropdownFieldName);
            dropdownField.addOptions(Object.values(options));
            dropdownField.select(defaultOption);
            dropdownField.addToPage(page, { x, y, width, height });


            const borderColor = apiColourChange(visual.borderColor);
            //pdf-lib v osnovi ne podpira "borderStyle":"DASH"
            const borderDashArray = visual.borderStyle === 'DASH' ? [6] : visual.borderStyle === 'DOT' ? [2, 2] : [];

            // iyris okvirja
            page.drawRectangle({
              x,
              y,
              width,
              height,
              borderColor,
              borderWidth: visual.borderWidth,
              color: rgb(1, 1, 1),
              opacity: 0.1,
              borderDashArray,
            });
          }
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();

      // Save PDF
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'modified_output.pdf';
      downloadLink.click();
    } catch (error) {
      console.error("Error modifying PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>PDF Modifier</h1>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        placeholder="api"
        style={{ width: '300px', marginRight: '10px', padding: '5px' }}
      />
      <input
        type="text"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        placeholder="pdf"
        style={{ width: '300px', marginRight: '10px', padding: '5px' }}
      />
      <button
        className={`bg-[#f29a41] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[rgb(34,25,16)] disabled:bg-gray-400`}
        onClick={modifyPdf} disabled={isLoading || !apiUrl || !pdfUrl}>
        {isLoading ? 'Modifying PDF...' : 'Modify PDF'}
      </button>
    </div>
  );
};

export default MainPage;

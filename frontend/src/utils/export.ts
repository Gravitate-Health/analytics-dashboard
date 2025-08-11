// src/utils/exportUtils.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the shape for a section of the report
interface ReportSection {
  title: string;
  data: { [key: string]: any }[];
}

/**
 * Exports a multi-section report to a single CSV file.
 * Sections are separated by titles and blank rows.
 * @param sections The array of report sections to export.
 * @param fileName The desired name of the output file.
 */
export const exportSectionsToCsv = (sections: ReportSection[], fileName: string) => {
  if (!sections || sections.length === 0) {
    alert('No data to export.');
    return;
  }

  const csvRows: string[] = [];

  sections.forEach(section => {
    if (section.data.length === 0) return;

    // Add section title
    csvRows.push(`"${section.title}"`);
    
    const headers = Object.keys(section.data[0]);
    csvRows.push(headers.join(',')); // Header row

    // Data rows
    section.data.forEach(row => {
      const values = headers.map(header => {
        const cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        return cell.includes(',') ? `"${cell}"` : cell;
      });
      csvRows.push(values.join(','));
    });

    csvRows.push(''); // Add a blank row for separation
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports a multi-section report to a single PDF file.
 * Each section gets its own title and table.
 * @param sections The array of report sections to export.
 * @param fileName The desired name of the output file.
 */
export const exportSectionsToPdf = (sections: ReportSection[], fileName: string) => {
  if (!sections || sections.length === 0) {
    alert('No data to export.');
    return;
  }

  const doc = new jsPDF();
  let finalY = 20; // Track the Y position for the next table

  doc.text('Dashboard Report', 14, finalY);
  finalY += 10;

  sections.forEach(section => {
    if (section.data.length === 0) return;
    
    doc.text(section.title, 14, finalY);
    finalY += 7;

    const headers = Object.keys(section.data[0]);
    const body = section.data.map(row => headers.map(header => row[header]));

    autoTable(doc, {
      startY: finalY,
      head: [headers],
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [38, 50, 56] },
    });
    
    // Update finalY to be below the newly added table
    finalY = (doc as any).lastAutoTable.finalY + 15;
  });

  doc.save(`${fileName}.pdf`);
};

/**
 * Creates and returns an export event handler function.
 * @param format The desired export format ('csv' or 'pdf').
 * @param prepareData A function that returns the report data in the required sections format.
 * @param fileName The base name for the exported file.
 * @returns An event handler function `() => void`.
 */
export const createExportHandler = (
    format: 'csv' | 'pdf',
    prepareData: () => ReportSection[],
    fileName: string
  ) => {
    // This is the actual handler that will be returned and used in your component
    return () => {
      const reportData = prepareData();
      
      if (!reportData || reportData.length === 0 || reportData.every(s => s.data.length === 0)) {
        alert('No data available to export.');
        return;
      }
  
      if (format === 'csv') {
        exportSectionsToCsv(reportData, fileName);
      } else {
        exportSectionsToPdf(reportData, fileName);
      }
    };
  };
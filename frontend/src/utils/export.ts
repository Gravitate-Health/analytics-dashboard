import { TFunction } from 'i18next';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportSection {
  title: string;
  data: { [key: string]: any }[];
}

const hasDataToExport = (sections: ReportSection[]): boolean => {
    if (!sections || sections.length === 0 || sections.every(s => s.data.length === 0)) {
        return false;
    }
    return true;
  };

export const exportSectionsToCsv = (sections: ReportSection[], fileName: string) => {
  
  if (!hasDataToExport(sections)) return;

  const csvRows: string[] = [];

  sections.forEach(section => {
    if (section.data.length === 0) return;

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

export const exportSectionsToPdf = (sections: ReportSection[], fileName: string) => {
  
    if (!hasDataToExport(sections)) return;

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

export const createExportHandler = (format: 'csv' | 'pdf', prepareData: () => ReportSection[], fileName: string, t: TFunction) => {
    return () => {
      const reportData = prepareData();
      
      if (!hasDataToExport(reportData)) {
        alert(t('errors.exportError')); 
        return;
      }
  
      if (format === 'csv') {exportSectionsToCsv(reportData, fileName);} 
      else {exportSectionsToPdf(reportData, fileName);}
    };
  };
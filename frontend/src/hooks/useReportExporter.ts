import { useCallback } from 'react';
import { exportSectionsToCsv, exportSectionsToPdf } from '../utils/export';

export interface ReportSection {
  title: string;
  data: Record<string, any>[];
}

interface UseReportExporterProps<T> {
  data: T | undefined | null;
  prepareReportFn: (data: T) => ReportSection[];
  filenamePrefix: string;
}

export const useReportExporter = <T>({ data, prepareReportFn, filenamePrefix }: UseReportExporterProps<T>) => {
  
  const handleExport = useCallback((exportFunction: (sections: ReportSection[], filename: string) => void) => {
    if (!data) {
      console.warn("Export attempted with no data.");
      return;
    }
    const reportData = prepareReportFn(data);
    if (reportData.length > 0) {
      exportFunction(reportData, filenamePrefix);
    }
  }, [data, prepareReportFn, filenamePrefix]);

  const handleExportCsv = useCallback(() => {
    handleExport(exportSectionsToCsv);
  }, [handleExport]);
  
  const handleExportPdf = useCallback(() => {
    handleExport(exportSectionsToPdf);
  }, [handleExport]);

  return { handleExportCsv, handleExportPdf };
};
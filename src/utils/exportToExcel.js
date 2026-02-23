import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Export specific data to an Excel (.xlsx) file
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} fileName - Name of the output file (without .xlsx extension)
 * @param {string} sheetName - Name of the specific Excel sheet within the file
 */
export const exportToExcel = (data, fileName, sheetName = 'Report') => {
    // 1. Create a new workbook
    const workbook = XLSX.utils.book_new();

    // 2. Convert raw JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns based on header keys
    const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length, 15) // minimum width of 15
    }));
    worksheet['!cols'] = colWidths;

    // 3. Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Generate buffer and save
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

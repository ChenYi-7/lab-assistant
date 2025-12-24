
import { LabTestRecord } from '../types';
import ExcelJS from 'exceljs';

const getAverage = (v1: any, v2: any) => {
  const n1 = parseFloat(v1);
  const n2 = parseFloat(v2);
  if (!isNaN(n1) && !isNaN(n2)) return (n1 + n2) / 2;
  return '-';
};

export async function exportToExcel(records: LabTestRecord[]) {
  if (records.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Lab Test Details');

  // Define Columns for the vertical row structure
  worksheet.columns = [
    { header: '测试日期', key: 'date', width: 15 },
    { header: '样品名称', key: 'name', width: 20 },
    { header: '温度 (°C)', key: 'temp', width: 12 },
    { header: '记录类型', key: 'type', width: 15 },
    { header: 'Foam (score)', key: 'foamScore', width: 15 },
    { header: 'Foam (ml)', key: 'foamMl', width: 15 },
    { header: 'Foam Pic', key: 'foamPic', width: 25 },
    { header: 'Coating', key: 'coating', width: 15 },
    { header: 'Coating Pic', key: 'coatingPic', width: 25 },
    { header: 'Floating Lumps', key: 'lumps', width: 18 },
    { header: 'Floating Lumps Pic', key: 'lumpsPic', width: 25 },
    { header: 'Lumping', key: 'lumping', width: 15 },
    { header: 'Lumping Pic', key: 'lumpingPic', width: 25 },
  ];

  // Header Styling
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' },
  };

  let currentRow = 2;

  const addImageToCell = (base64: string | undefined, colIndex: number, rowIndex: number) => {
    if (!base64) return;
    try {
      const imageId = workbook.addImage({
        base64: base64.split(',')[1] || base64,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: colIndex - 1, row: rowIndex - 1 },
        ext: { width: 100, height: 100 },
        editAs: 'oneCell'
      });
    } catch (err) {
      console.warn('Could not add image to excel', err);
    }
  };

  for (const r of records) {
    // Row 1: Trial 1
    const t1Row = worksheet.addRow({
      date: r.testDate,
      name: r.sampleName,
      temp: r.temperature,
      type: '测试 1',
      foamScore: r.trial1.foamScore,
      foamMl: r.trial1.foamMl,
      coating: r.trial1.coating,
      lumps: r.trial1.floatingLumps,
      lumping: r.trial1.lumping,
    });
    t1Row.height = 80;
    addImageToCell(r.trial1.foamPic, 7, currentRow);
    addImageToCell(r.trial1.coatingPic, 9, currentRow);
    addImageToCell(r.trial1.floatingLumpsPic, 11, currentRow);
    addImageToCell(r.trial1.lumpingPic, 13, currentRow);
    currentRow++;

    // Row 2: Trial 2
    const t2Row = worksheet.addRow({
      date: r.testDate,
      name: r.sampleName,
      temp: r.temperature,
      type: '测试 2',
      foamScore: r.trial2.foamScore,
      foamMl: r.trial2.foamMl,
      coating: r.trial2.coating,
      lumps: r.trial2.floatingLumps,
      lumping: r.trial2.lumping,
    });
    t2Row.height = 80;
    addImageToCell(r.trial2.foamPic, 7, currentRow);
    addImageToCell(r.trial2.coatingPic, 9, currentRow);
    addImageToCell(r.trial2.floatingLumpsPic, 11, currentRow);
    addImageToCell(r.trial2.lumpingPic, 13, currentRow);
    currentRow++;

    // Row 3: Averages
    const avgRow = worksheet.addRow({
      date: r.testDate,
      name: r.sampleName,
      temp: r.temperature,
      type: '平均值',
      foamScore: getAverage(r.trial1.foamScore, r.trial2.foamScore),
      foamMl: getAverage(r.trial1.foamMl, r.trial2.foamMl),
      coating: '-',
      lumps: getAverage(r.trial1.floatingLumps, r.trial2.floatingLumps),
      lumping: getAverage(r.trial1.lumping, r.trial2.lumping),
    });
    avgRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1F5F9' }, // slate-100
    };
    avgRow.font = { italic: true, bold: true };
    currentRow++;

    // Add empty spacer row
    worksheet.addRow({});
    currentRow++;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Lab_Detailed_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

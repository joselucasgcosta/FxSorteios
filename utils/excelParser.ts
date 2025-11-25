import * as XLSX from 'xlsx';
import { Participant } from '../types';

export const parseExcelFile = async (file: File): Promise<Participant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Falha ao ler o arquivo"));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to array of arrays to handle columns by index (A, B, C)
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        const participants: Participant[] = [];
        let totalWeight = 0;

        // Iterate rows. Assuming Row 1 is header, we start from Row 2 (index 1)
        // Adjust if your file has no headers. We will try to sniff.
        const startRow = 1; 

        for (let i = startRow; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Column A (0) = Code, B (1) = Name, C (2) = Weight
          const code = row[0] ? String(row[0]).trim() : '';
          const name = row[1] ? String(row[1]).trim() : '';
          // Ensure weight is a number, default to 1 if missing or invalid
          let weight = row[2] ? parseFloat(row[2]) : 1;
          
          if (isNaN(weight) || weight < 0) weight = 0;

          if (code && name && weight > 0) {
            participants.push({
              id: crypto.randomUUID(),
              code,
              name,
              weight,
              winChance: 0
            });
            totalWeight += weight;
          }
        }

        if (participants.length === 0) {
          reject(new Error("Nenhum participante válido encontrado. Verifique se as colunas A (Código), B (Nome) e C (Peso) estão preenchidas."));
          return;
        }

        // Calculate win chance percentage for UI display
        const participantsWithStats = participants.map(p => ({
          ...p,
          winChance: (p.weight / totalWeight) * 100
        }));

        resolve(participantsWithStats);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
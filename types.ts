
export interface TrialData {
  foamScore: number;
  foamMl: number;
  foamPic?: string;
  coating: string;
  coatingPic?: string;
  floatingLumps: string;
  floatingLumpsPic?: string;
  lumping: string;
  lumpingPic?: string;
}

export interface LabTestRecord {
  id: string;
  testDate: string;
  sampleName: string;
  temperature: string;
  trial1: TrialData;
  trial2: TrialData;
  createdAt: number;
}

export type ViewState = 'FORM' | 'LIST';

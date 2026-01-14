import { Student } from 'src/entities/student.entity';
import { CredentialType } from 'src/enums/credential_type.enum';

export const normalizedData = (
  student: Student,
  credentialType: CredentialType,
): string => {
  switch (credentialType) {
    case CredentialType.TOR:
      return normalizeTOR(student);
    case CredentialType.DIPLOMA:
      return normalizeDiploma(student);
    case CredentialType.HONORABLE_DISMISSAL:
      return normalizeHonnorableDismissal(student);
    case CredentialType.GOOD_MORAL:
      return normalizeGoodMoral(student);
    case CredentialType.CERT_OF_GRADES:
      return normalizeCertOfGrades(student);
    case CredentialType.CERT_OF_ENROLLMENT:
      return normalizeCertOfEnrollment(student);
    case CredentialType.UNITS_EARNED:
      return normalizeUnitsEarned(student);
    case CredentialType.GWA:
      return normalizeGWA(student);
    case CredentialType.LIST_OF_GRADES:
      return normalizeListOfGrades(student);
    case CredentialType.CAV:
      return normalizeCAV(student);
    default:
      throw new Error('Unsupported credential type');
  }
};

const normalizeTOR = (student: Student): string => {
  const result: string[] = [];

  const { academicRecords, elementary, secondary, ...rest } = student;

  function traverse(value: any) {
    if (Array.isArray(value)) {
      value.forEach(traverse);
      return;
    }

    if (value !== null && typeof value === 'object') {
      Object.values(value).forEach(traverse);
      return;
    }

    result.push(String(value));
  }

  traverse(rest);
  traverse(elementary);
  traverse(secondary);
  academicRecords.forEach((record) => {
    const { student, subjectsTaken, ...rest } = record;

    subjectsTaken.forEach((item) => {
      const { academicRecord, ...restOfItem } = item;

      traverse(restOfItem);
    });
  });
  return result.join(' ');
};
const normalizeDiploma = (student: Student): string => {
  return '';
};
const normalizeHonnorableDismissal = (student: Student): string => {
  return '';
};
const normalizeGoodMoral = (student: Student): string => {
  return '';
};
const normalizeCertOfGrades = (student: Student): string => {
  return '';
};
const normalizeCertOfEnrollment = (student: Student): string => {
  return '';
};
const normalizeUnitsEarned = (student: Student): string => {
  return '';
};
const normalizeGWA = (student: Student): string => {
  return '';
};
const normalizeListOfGrades = (student: Student): string => {
  return '';
};
const normalizeCAV = (student: Student): string => {
  return '';
};

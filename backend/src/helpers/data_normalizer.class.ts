import { NotFoundException } from '@nestjs/common';
import { Student } from 'src/entities/student.entity';
import { CredentialType } from 'src/enums/credential_type.enum';
import { Semester } from 'src/enums/semester.enum';

export class CredentialNormalizer {
  /**
   * Main entry point to normalize student data based on credential type.
   */

  private yearNow: number = new Date().getFullYear();

  static normalize(
    student: Student | null,
    credentialType: CredentialType | null,
    cutOffYear?: string,
    cutOffSemester?: Semester,
  ): string {
    if (!student || !credentialType) {
      throw new NotFoundException(
        'No Student or Credential Type to be normalized',
      );
    }

    switch (credentialType) {
      case CredentialType.TOR:
        return this.normalizeTOR(student, cutOffYear!, cutOffSemester!);
      case CredentialType.DIPLOMA:
        return this.normalizeDiploma(student);
      case CredentialType.HONORABLE_DISMISSAL:
        return this.normalizeHonnorableDismissal(student);
      case CredentialType.GOOD_MORAL:
        return this.normalizeGoodMoral(student);
      case CredentialType.CERT_OF_GRADES:
        return this.normalizeCertOfGrades(student);
      case CredentialType.CERT_OF_ENROLLMENT:
        return this.normalizeCertOfEnrollment(student);
      case CredentialType.UNITS_EARNED:
        return this.normalizeUnitsEarned(student);
      case CredentialType.GWA:
        return this.normalizeGWA(student);
      case CredentialType.LIST_OF_GRADES:
        return this.normalizeListOfGrades(student);
      case CredentialType.CAV:
        return this.normalizeCAV(student);
      default:
        throw new Error(`Unsupported credential type: ${credentialType}`);
    }
  }

  // ==========================================
  // Private Normalization Methods
  // ==========================================

  private static normalizeTOR(
    student: Student,
    cutOffYear: string,
    cutOffSemester: Semester,
  ): string {
    const result: string[] = [];

    result.push(student.id);
    result.push(student.firstName);
    result.push(student.middleName);
    result.push(student.lastName);
    result.push(cutOffYear);
    result.push(cutOffSemester.toString());

    // sort first by year and semester
    const records = student.academicRecords
      .filter((record) => {
        return (
          record.schoolYear <= cutOffYear && record.semester <= cutOffSemester
        );
      })
      .sort(this.byYearThenSemester);

    for (const record of records) {
      result.push(record.schoolYear);
      result.push(String(record.semester));

      const subjects = record.subjectsTaken
        .slice()
        .sort((a, b) => a.subject.code.localeCompare(b.subject.code));

      for (const s of subjects) {
        result.push(s.subject.code);
        result.push(String(s.grade));
        result.push(String(s.subject.units));
      }
    }

    return result.join(' | ');
  }

  private static normalizeDiploma(student: Student): string {
    return '';
  }

  private static normalizeHonnorableDismissal(student: Student): string {
    return '';
  }

  private static normalizeGoodMoral(student: Student): string {
    return '';
  }

  private static normalizeCertOfGrades(student: Student): string {
    return '';
  }

  private static normalizeCertOfEnrollment(student: Student): string {
    return '';
  }

  private static normalizeUnitsEarned(student: Student): string {
    return '';
  }

  private static normalizeGWA(student: Student): string {
    return '';
  }

  private static normalizeListOfGrades(student: Student): string {
    return '';
  }

  private static normalizeCAV(student: Student): string {
    return '';
  }

  private static byYearThenSemester(a, b) {
    const yearA = parseInt(a.schoolYear.split('-')[0], 10);
    const yearB = parseInt(b.schoolYear.split('-')[0], 10);

    if (yearA !== yearB) {
      return yearA - yearB; // earlier years first
    }

    return a.semester - b.semester; // 1st sem before 2nd sem
  }
}

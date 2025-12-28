import { IssueCredentialDto } from 'src/dto/issue_credential.dto';

export const normalizeCredentialData = (
  credential: IssueCredentialDto,
): string => {
  return `${credential.studentName}${credential.degree}${credential.gwa}`
    .trim()
    .toLowerCase();
};

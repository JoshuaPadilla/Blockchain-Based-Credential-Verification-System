import React from 'react'; // Required for JSX
import { Student } from '../entities/student.entity';
import { CredentialType } from '../enums/credential_type.enum';
import { Diploma } from '../../pdf_templates/diploma/diploma';

// Import your actual components here
// import { HonorableDismissal } from './HonorableDismissal';

export const getPdfToRender = (
  student: Student,
  credentialName: CredentialType,
  qrData: string,
): React.ReactElement | null => {
  switch (credentialName) {
    case CredentialType.DIPLOMA:
      return (
        <Diploma
          course={student.course}
          distinction={student.academic_distinction}
          name={`${student.firstName} ${student.middleName} ${student.lastName}`}
          qrCodeUrl={qrData}
        />
      );

    // case CredentialType.HONORABLE_DISMISSAL:
    //   // return <HonorableDismissal student={student} />;
    //   return null;

    // case CredentialType.GOOD_MORAL:
    //   return <div>Good Moral Certificate Component</div>; // Example placeholder

    // case CredentialType.CERT_OF_GRADES:
    // case CredentialType.CERT_OF_ENROLLMENT:
    // case CredentialType.UNITS_EARNED:
    // case CredentialType.GWA:
    // case CredentialType.LIST_OF_GRADES:
    // case CredentialType.CAV:

    default:
      throw new Error(`Unsupported credential type: ${credentialName}`);
  }
};

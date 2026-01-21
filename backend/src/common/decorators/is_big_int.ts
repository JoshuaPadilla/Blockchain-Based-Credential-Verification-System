import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBigInt(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBigInt',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            BigInt(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return '$property must be a BigInt';
        },
      },
    });
  };
}

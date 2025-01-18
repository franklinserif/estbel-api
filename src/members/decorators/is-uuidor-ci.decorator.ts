import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUUIDOrCI(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUUIDOrCI',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(value)) {
            return true;
          }

          const cedulaRegex = /^\d{7,14}$/;
          if (cedulaRegex.test(value)) {
            return true;
          }

          return false;
        },
        defaultMessage() {
          return `$property must be a valid UUID or CI`;
        },
      },
    });
  };
}

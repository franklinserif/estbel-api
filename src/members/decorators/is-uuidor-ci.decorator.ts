import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to validate if a value is either a valid UUID or a CI (Cedula de Identidad).
 *
 * @param {ValidationOptions} [validationOptions] - Optional validation options.
 * @returns {Function} - The decorator function.
 */
export function IsUUIDOrCI(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
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
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid UUID or CI`;
        },
      },
    });
  };
}

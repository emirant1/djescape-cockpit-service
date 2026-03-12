import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * This is where the business logic of the constraint will be implemented. Here we will validate
 * a date in the format dd.MM.yyyy which is provided by the user input.
 */
@ValidatorConstraint({ name: 'isCustomDate', async: false })
export class IsCustomDateConstraint implements ValidatorConstraintInterface {
  /* The regular expression that will be used in the date validation */
  static readonly dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

  validate(value: string) {
    /* Check if it's a string and matches the pattern dd.MM.yyyy */
    if (!IsCustomDateConstraint.dateRegex.test(value)) return false;

    /* Check if it's a valid calendar date */
    const [day, month, year] = value.split('.').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  defaultMessage() {
    return 'Date must be a valid calendar date in the format dd.MM.yyyy';
  }
}

/**
 * This is the annotation that will be used on the object
 * @param validationOptions Additional validation options
 * @constructor Additional validation options can be specified
 */
export function IsCustomDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCustomDateConstraint,
    });
  };
}

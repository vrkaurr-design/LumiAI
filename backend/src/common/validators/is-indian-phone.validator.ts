import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsIndianPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIndianPhone',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;
                    // Indian phone (+91 or 0) followed by 10 digits starting with 6-9
                    return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value);
                },
                defaultMessage() {
                    return 'Invalid Indian phone number';
                },
            },
        });
    };
}

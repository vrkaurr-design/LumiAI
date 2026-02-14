import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidSku(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidSku',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;
                    // Alphanumeric, hyphen, underscore, 3-20 chars
                    return /^[a-zA-Z0-9\-_]{3,20}$/.test(value);
                },
                defaultMessage() {
                    return 'SKU must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores';
                },
            },
        });
    };
}

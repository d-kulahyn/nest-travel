import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export function Match(property: string, validationOptions?: ValidationOptions): Function {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments: ValidationArguments): Promise<boolean> | boolean {
                    if (value === undefined) return false;
                    const relatedValue: any = (validationArguments.object as any)[property];
                    return value.localeCompare(relatedValue) === 0;
                }
            }
        })
    }
}
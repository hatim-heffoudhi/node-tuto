/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { UsersController } from './controllers/Users.controllers';

const models: TsoaRoute.Models = {
    "Name": {
        "properties": {
            "first": { "dataType": "string", "required": true },
            "last": { "dataType": "string" },
        },
    },
    "User": {
        "properties": {
            "id": { "dataType": "double", "required": true },
            "name": { "ref": "Name", "required": true },
            "email": { "dataType": "string", "required": true },
            "status": { "dataType": "enum", "enums": ["Happy", "Sad"] },
            "phoneNumbers": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "UserCreationRequest": {
        "properties": {
            "email": { "dataType": "string", "required": true },
            "name": { "ref": "Name", "required": true },
            "phoneNumbers": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
};

export function RegisterRoutes(router: any) {
    router.get('/v1/users',
        async (context, next) => {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new UsersController();

            const promise = controller.getUsers.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.post('/v1/users',
        async (context, next) => {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserCreationRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new UsersController();

            const promise = controller.createUser.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.get('/v1/users/:id',
        async (context, next) => {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new UsersController();

            const promise = controller.getUser.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });


    function promiseHandler(controllerObj: any, promise: Promise<any>, context: any, next: () => Promise<any>) {
        return Promise.resolve(promise)
            .then((data: any) => {
                if (data) {
                    context.body = data;
                    context.status = 200;
                } else {
                    context.status = 204;
                }

                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        context.set(name, headers[name]);
                    });

                    const statusCode = controller.getStatus();
                    if (statusCode) {
                        context.status = statusCode;
                    }
                }
                next();
            })
            .catch((error: any) => {
                context.status = error.status || 500;
                context.body = error;
                next();
            });
    }

    function getValidatedArgs(args: any, context: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return context.request;
                case 'query':
                    return ValidateParam(args[key], context.request.query[name], models, name, errorFields)
                case 'path':
                    return ValidateParam(args[key], context.params[name], models, name, errorFields)
                case 'header':
                    return ValidateParam(args[key], context.request.headers[name], models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], context.request.body, models, name, errorFields, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], context.request.body[name], models, name, errorFields, 'body.');
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}

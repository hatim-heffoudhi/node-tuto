// import * as Koa from 'koa';
// import * as Router from 'koa-router';
// import * as koaBody from 'koa-body';
//
// const app = new Koa();
// const router = new Router();
//
// app.use(koaBody());
// app.use(async (ctx, next) => {
//     console.log('Url:', ctx.url);
//     await next(); // Pass the request to the next middleware function
// });
//
// const users = [
//     {name: 'Alfred', email: 'alfred@gmail.com'},
//     {name: 'Brice', email: 'brice@gmail.com'},
//     {name: 'Charles', email: 'charles@gmail.com'},
// ];
//
// router.get('/user/:id', ctx => {
//     ctx.body = users[ctx.params.id];
// });
// router.post('/user/:id', ctx => {
//     console.log('body', ctx.request['body']);
//     ctx.body = Object.assign(users[ctx.params.id], ctx.request['body']);
// });
//
// router.get('/*', async (ctx) => {
//     ctx.body = 'Hello World!';
// });
//
//
//
// app.use(router.allowedMethods());
// app.use(router.routes());
//
// app.listen(3000);
// console.log('Server running on port 3000');
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaBody from 'koa-body';
import * as koaCors from '@koa/cors';
import {RegisterRoutes} from './routes';
import * as koaMount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as koaSwagger from 'koa2-swagger-ui';
import {UsersController} from './controllers/Users.controllers';


class Server {

    // List of controllers, not used in code, just to be sure they are imported for TSOA generator
    controllers = [
        UsersController,
    ];

    constructor() {
    }

    configureKoa(): Koa {
        const koa = new Koa();
        koa.use(async (ctx, next) => {
            console.log('Url:', ctx.url);
            await next(); // Pass the request to the next middleware function
        });
        koa.use(koaBody());
        koa.use(koaCors());
        return koa;
    }

    configureSwagger(koa: Koa) {
        koa.use(koaMount('/swagger-def', koaStatic('swagger-def')));
        koa.use(
            koaSwagger({
                routePrefix: '/swagger', // host at /swagger instead of default /docs
                swaggerOptions: {
                    url: 'http://localhost:3000/swagger-def/v1/swagger.yaml', // path to yaml or json
                },
            }),
        );
    }


    configureRouter(koa: Koa): void {
        const koaRouter = new KoaRouter();
        RegisterRoutes(koaRouter);
        // this.koaRouter.get('/*', async (ctx) => {
        //     ctx.body = 'Hello World!';
        // });
        koa.use(koaRouter.allowedMethods());
        koa.use(koaRouter.routes());
    }

    start(): void {
        const koa = this.configureKoa();
        this.configureRouter(koa);
        this.configureSwagger(koa);
        koa.listen(3000);
        console.log('Server running on port 3000');
    }

}

const server = new Server();
server.start();
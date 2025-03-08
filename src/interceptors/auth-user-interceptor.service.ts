// import type {
//   CallHandler,
//   ExecutionContext,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Injectable } from '@nestjs/common';

// import type { UserEntity } from '../modules/user/user.entity.ts';
// import { ContextProvider } from '../providers/context.provider.ts';

// @Injectable()
// export class AuthUserInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler) {
//     const request = context.switchToHttp().getRequest<{ user: UserEntity }>();

//     const user = request.user;
//     ContextProvider.setAuthUser(user);

//     return next.handle();
//   }
// }


import type {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
  } from '@nestjs/common'; // 1) Import types from NestJS common package for interceptors.
  import { Injectable } from '@nestjs/common'; // 2) Import Injectable decorator to mark this class as a NestJS provider.
  
  import type { UserEntity } from '../modules/user/user.entity.ts'; // 3) Import the UserEntity type (no runtime import, just a type).
  import { ContextProvider } from '../providers/context.provider.ts'; // 4) Import a custom provider that stores request-scoped data.
  
  @Injectable() // 5) Decorator making this class a provider in the NestJS dependency injection system.
  export class AuthUserInterceptor implements NestInterceptor {
    // 6) Class implements NestInterceptor interface, which requires an 'intercept' method.
  
    intercept(context: ExecutionContext, next: CallHandler) {
      // 7) The 'intercept' method is called before the route handler.
      //    It can transform or use the request/response in some way.
  
      const request = context.switchToHttp().getRequest<{ user: UserEntity }>();
      // 8) Convert the execution context to an HTTP context and get the Request object.
      //    We type the request so it expects 'user: UserEntity' on the request object.
  
      const user = request.user;
      // 9) Extract the 'user' property from the request.
      //    Typically, this 'user' is attached by an authentication guard (e.g., JWT guard).
  
      ContextProvider.setAuthUser(user);
      // 10) Store the extracted user in a 'ContextProvider',
      //     which uses NestJS CLS or a similar mechanism to save request-scoped data.
  
      return next.handle();
      // 11) Proceed to the next step in the request/response pipeline.
      //     This eventually calls the route handler method (controller).
    }
  }
  
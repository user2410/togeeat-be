import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

function prepareResponse(exception: Error, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  return {
    ctx,
    response: ctx.getResponse<Response>(),
    message: exception.message.replace(/\n/g, ''),
  }
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const { response, message } = prepareResponse(exception, host);
    let status;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    console.error('[Exception]:', exception);
    const { response, message } = prepareResponse(exception, host);
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}

@Catch(
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientUnknownRequestError)
export class PrismaClientInternalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.error(exception.message);
    const { response, message } = prepareResponse(exception, host);
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
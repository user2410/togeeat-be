import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [AuthRepository, AuthService, JwtService, JwtStrategy],
  exports: [AuthRepository, AuthService, JwtService, JwtStrategy]
})
export class CustomJwtModule { }
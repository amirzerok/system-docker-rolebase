//src/app.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // مسیر صحیح برای PrismaService

// ماژول‌های مربوط به کاربران و نقش‌ها
import { RoleController } from './users/role.controller'; // مسیر صحیح را وارد کنید
import { RoleService } from './users/role.service'; // مسیر صحیح را وارد کنید
import { UsersModule } from './users/users.module'; // ماژول کاربران
import { AuthModule } from './auth/auth.module'; // ماژول احراز هویت

// ماژول جدید مکان‌ها
import { LocationsModule } from './users/locations.module'; // ماژول مکان‌ها

@Module({
  imports: [
    UsersModule, // ماژول کاربران
    AuthModule,  // ماژول احراز هویت
    LocationsModule, // ماژول مکان‌ها که اضافه شده است
  ],
  controllers: [
    RoleController, // کنترلر نقش‌ها
  ],
  providers: [
    RoleService,   // سرویس مربوط به نقش‌ها
    PrismaService, // سرویس Prisma برای ارتباط با دیتابیس
  ],
  exports: [
    RoleService,   // در صورت نیاز به صادر کردن RoleService به سایر ماژول‌ها
  ],
})
export class AppModule {}

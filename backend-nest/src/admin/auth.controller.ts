import { Controller, Post, Body, Get, UseGuards, Request, Patch, Put, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    async login(@Body() body: any) {
        const { email, password } = body;
        const user: any = await this.adminService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            return {
                token: 'real_token_' + user.id,
                admin: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                }
            };
        }
        return { message: 'Invalid credentials' };
    }

    @Post('register')
    async register(@Body() userData: any) {
        const user: any = await this.adminService.create(userData);
        return {
            token: 'real_token_' + user.id,
            admin: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            }
        };
    }

    @Get('profile')
    async getProfile(@Request() req: any) {
        // Mocking for now - ideally get current user from JWT
        const users: any = await this.adminService.findAll();
        if (users && users.length > 0) {
            const user: any = users[0];
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            };
        }
        return { message: 'User not found' };
    }

    @Put('profile')
    async updateProfile(@Body() userData: any) {
        // Mocking update for the first user or by email
        const user: any = await this.adminService.findByEmail(userData.email);
        if (user) {
            const updated: any = await this.adminService.update(user.id, userData);
            return {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                avatar: updated.avatar,
            };
        }
        return { message: 'User not found' };
    }

    @Patch('profile')
    async patchProfile(@Body() userData: any) {
        return this.updateProfile(userData);
    }

    @Put('password')
    async updatePassword(@Body() body: any) {
        const { email, currentPassword, newPassword } = body;
        const user: any = await this.adminService.findByEmail(email);

        if (!user) {
            return { message: 'Usuário não encontrado' };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { message: 'Senha atual incorreta' };
        }

        await this.adminService.update(user.id, { password: newPassword });
        return { message: 'Senha alterada com sucesso!' };
    }

    @Delete('account')
    async deleteAccount(@Query('email') email: string) {
        const user: any = await this.adminService.findByEmail(email);
        if (user) {
            await this.adminService.remove(user.id);
            return { message: 'Conta excluída com sucesso!' };
        }
        return { message: 'Usuário não encontrado' };
    }
}

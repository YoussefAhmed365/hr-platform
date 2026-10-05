import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../../lib/auth/better-auth.js';

@Controller('api/auth')
export class AuthController {
	@All('*')
	async handleAuth(@Req() req: Request, @Res() res: Response) {
		// toNodeHandler يتولى فحص المسار والرد تلقائياً (login, signup, session, org, etc.)
		return toNodeHandler(auth)(req, res);
	}
}
import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { ok } from '../../common/response';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  health() {
    return ok({ status: 'ok' });
  }
}

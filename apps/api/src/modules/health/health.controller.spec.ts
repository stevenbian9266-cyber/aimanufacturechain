import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    const ctrl = moduleRef.get(HealthController);
    expect(ctrl.health()).toEqual({ ok: true, data: { status: 'ok' } });
  });
});

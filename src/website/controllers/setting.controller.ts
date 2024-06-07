import { Controller, Get } from '@nestjs/common';
import { SettingService } from '../services/setting.service';
import { res } from 'src/common/response.helper';

@Controller('settings')
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Get()
    async getSetting() {
        const response = await this.settingService.getSetting()
        return res.success(response)
    }
}
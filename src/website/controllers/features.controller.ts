import { Controller, Get } from "@nestjs/common"
import { FeaturesService } from "../services/features.service"
import { res } from "src/common/response.helper"


@Controller('features')
export class FeaturesController {
    constructor(private readonly featureService: FeaturesService) { }

    @Get()
    async getFeature() {
        const response = await this.featureService.getFeatures()
        return res.success(response)
    }
}
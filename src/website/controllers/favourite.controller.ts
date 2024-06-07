import { Body, Controller, Get,Param,Post } from "@nestjs/common";
import { res } from "src/common/response.helper";

import { FavouriteDto } from "../dtos/favourite.dto";
import { FavouriteService } from "../services/favourite.service";


@Controller('favourite')
export class FavouriteController {
    constructor(private readonly favouriteService: FavouriteService) { }

    @Post()
    async setFavouriteTeacher(@Body() data: FavouriteDto) {
        const response = await this.favouriteService.setFavouriteTeacher(data)
        return res.success(response, "Success")
    }
}

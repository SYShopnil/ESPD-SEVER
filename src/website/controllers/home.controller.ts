/* eslint-disable */

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { HomeService } from '../services/home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomeData() {
    try {
      return await this.homeService.getHomeData();
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
}

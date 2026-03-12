import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { AboutService } from '../service/about.service';
import { ResponseAboutDto } from '../dto/response-about.dto';
import { RequestAboutDto } from '../dto/request-about.dto';
import { Roles } from '../../../auth/decorator/roles.decorator';
import { UserRole } from '../../../auth/entity/user.entity';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guard/roles-guard';

@Controller('cockpit/about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {
    /* Empty body */
  }

  @Get()
  getAbout(@Req() req: express.Request): Promise<ResponseAboutDto> {
    return this.aboutService.getAbout(this.getBaseUrl(req));
  }

  @Get('list')
  getAboutList(@Req() req: express.Request): Promise<ResponseAboutDto[]> {
    return this.aboutService.getAllAbouts(this.getBaseUrl(req));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createAbout(
    @Body() request: RequestAboutDto,
    @Req() req: express.Request,
  ): Promise<ResponseAboutDto> {
    return this.aboutService.createAbout(request, this.getBaseUrl(req));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateAbout(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: RequestAboutDto,
    @Req() req: express.Request,
  ): Promise<ResponseAboutDto> {
    return this.aboutService.updateAbout(id, request, this.getBaseUrl(req));
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAbout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.aboutService.deleteAbout(id);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDeleteAbout(): Promise<void> {
    return this.aboutService.hardDeleteAllAbouts();
  }

  private getBaseUrl(req: express.Request): string {
    return `${req.protocol}://${req.get('host')}`;
  }
}

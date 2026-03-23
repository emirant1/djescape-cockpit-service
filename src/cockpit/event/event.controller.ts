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
import { EventService } from './service/event.service';
import { ResponseEventDto } from './dto/response-event.dto';
import { RequestEventDto } from './dto/request-event.dto';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '../../auth/entity/user.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles-guard';

@Controller('api/cockpit/event')
export class EventController {
  constructor(private readonly eventService: EventService) {
    /* Empty body */
  }

  @Get()
  getAllEvents(@Req() req: express.Request): Promise<ResponseEventDto[]> {
    return this.eventService.getAllEvents(this.getBaseUrl(req));
  }

  @Get(':id')
  getEvent(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<ResponseEventDto> {
    return this.eventService.getEventById(id, this.getBaseUrl(req));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createEvents(
    @Body() request: RequestEventDto[],
    @Req() req: express.Request,
  ): Promise<ResponseEventDto[]> {
    return this.eventService.createEvents(request, this.getBaseUrl(req));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: RequestEventDto,
    @Req() req: express.Request,
  ): Promise<ResponseEventDto> {
    return this.eventService.updateEventById(id, request, this.getBaseUrl(req));
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEvent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.eventService.deleteEvent(id);
  }

  private getBaseUrl(req: express.Request): string {
    return `${req.protocol}://${req.get('host')}`;
  }
}

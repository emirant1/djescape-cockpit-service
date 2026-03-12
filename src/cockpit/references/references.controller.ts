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
} from '@nestjs/common';
import express from 'express';
import { ReferencesService } from './references.service';
import { ResponseReferenceDto } from './dto/response-reference.dto';
import { RequestReferenceDto } from './dto/request-reference.dto';

@Controller('cockpit/reference')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {
    /* Empty body */
  }

  @Get()
  getAllReferences(
    @Req() req: express.Request,
  ): Promise<ResponseReferenceDto[]> {
    return this.referencesService.getAllReferences(this.getBaseUrl(req));
  }

  @Get(':id')
  getReference(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<ResponseReferenceDto> {
    return this.referencesService.getReferenceById(id, this.getBaseUrl(req));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createReference(
    @Body() request: RequestReferenceDto,
    @Req() req: express.Request,
  ): Promise<ResponseReferenceDto> {
    return this.referencesService.createReference(
      request,
      this.getBaseUrl(req),
    );
  }

  @Put(':id')
  updateReference(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: RequestReferenceDto,
    @Req() req: express.Request,
  ): Promise<ResponseReferenceDto> {
    return this.referencesService.updateReferenceById(
      id,
      request,
      this.getBaseUrl(req),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteReference(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.referencesService.deleteReference(id);
  }

  private getBaseUrl(req: express.Request): string {
    return `${req.protocol}://${req.get('host')}`;
  }
}

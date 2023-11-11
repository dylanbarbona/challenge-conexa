import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Movie } from '@app/movie/domain/entities/movie.entity';
import { SearchMovieDto } from '@app/movie/domain/dto/search-movie.dto';
import { CreateMovieDto } from '@app/movie/domain/dto/create-movie.dto';
import { UpdateMovieDto } from '@app/movie/domain/dto/update-movie.dto';
import {
  IMovieService,
  MOVIE_SERVICE,
} from '@app/movie/domain/contracts/movie.service';
import { UserGuard } from '@app/main/auth/guards/user.guard';
import { RolesGuard } from '@app/main/auth/guards/roles.guard';
import { Roles } from '@app/main/auth/guards/roles.decorator';
import { Role } from '@app/auth/domain/entities/role.entity';

@ApiTags('Movie')
@Controller({
  path: '/movie',
  version: '1',
})
export class MovieController {
  constructor(
    @Inject(MOVIE_SERVICE) private readonly movieService: IMovieService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Buscar películas' })
  @ApiAcceptedResponse({ type: [Movie] })
  find(@Query() input: SearchMovieDto): Observable<Movie[]> {
    return this.movieService.find(input);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar película por ID' })
  @ApiAcceptedResponse({ type: Movie })
  @Get('/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(Role.Regular)
  findById(@Param('id') id: string): Observable<Movie> {
    return this.movieService.findById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva película' })
  @ApiCreatedResponse({ type: Movie })
  @Post('/')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(Role.Administrator)
  create(@Body() input: CreateMovieDto): Observable<Movie> {
    return this.movieService.create(input);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una película' })
  @ApiAcceptedResponse({ type: Movie })
  @Put('/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(Role.Administrator)
  update(
    @Param('id') _id: number,
    @Body() input: UpdateMovieDto,
  ): Observable<Movie> {
    return this.movieService.update(_id, { ...input, external_id: _id });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una película' })
  @ApiAcceptedResponse({ type: Movie })
  @Delete('/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(Role.Administrator)
  delete(@Param('id') _id: number): Observable<Movie> {
    return this.movieService.delete({ external_id: _id });
  }
}

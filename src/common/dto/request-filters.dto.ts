import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString } from "class-validator";


export class RequestFiltersDto {

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsString()
    @IsOptional()
    search?: string;

}
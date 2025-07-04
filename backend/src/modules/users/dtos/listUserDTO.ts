import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class ListUserDTO {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsOptional()
  @IsIn([10, 50, 100], {
    message: "O tamanho da página deve ser 10, 50 ou 100",
  })
  take: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsIn(["name", "email", "createdAt", "updatedAt"]) // ex: campos que seu backend permite ordenar
  orderField?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  orderDirection: "asc" | "desc" = "asc";
}

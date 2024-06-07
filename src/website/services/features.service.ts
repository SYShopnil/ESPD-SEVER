import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FeaturesService {
    constructor(private readonly prismaservice: PrismaService) { }

    getFeatures() {
        return this.prismaservice.feature.findMany({})
    }
}
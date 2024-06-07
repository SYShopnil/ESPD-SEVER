import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { FavouriteDto } from "../dtos/favourite.dto";



@Injectable()
export class FavouriteService {
    constructor(private readonly prismaService: PrismaService) { }

    async setFavouriteTeacher(data: FavouriteDto) {
        let is_favorite = true;
        const isExistFavourite = await this.prismaService.favorite.findFirst({ where: { student_id: data.student_id, teacher_id: data.teacher_id } })
        if (isExistFavourite !== null) {
            is_favorite = false;
            await this.prismaService.favorite.delete({ where: { id: isExistFavourite.id } })
        } else {
            await this.prismaService.favorite.create({ data })
        }
        return { is_favorite };
    }

    async getFavouriteByStudentId(id: number) {
        const data = await this.prismaService.favorite.findMany({
            where: {
                student_id: id
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_photo: true,
                        bio: true,
                        description: true,
                        is_super_tutor: true,
                        price_one_to_one: true,
                        ExamBoardOnTeacher: {
                            select: {
                                ExamBoard: {
                                    select: {
                                        logo: true
                                    }
                                }
                            }
                        },
                        Review: {
                            select: {
                                rating: true
                            },
                        }
                    }
                }
            }
        });

        const response = [];
        data.map(item => {
            const exam_board_logos = item?.teacher?.ExamBoardOnTeacher?.map(item => item?.ExamBoard?.logo);
            response.push({
                teacher_id: item?.teacher?.id,
                first_name: item?.teacher?.first_name,
                profile_photo: item?.teacher?.profile_photo,
                last_name: item?.teacher?.last_name,
                exam_board_logo: exam_board_logos,
                bio: item?.teacher?.bio,
                hourly_rate: item?.teacher?.price_one_to_one,
                review: item?.teacher.Review,
                description: item?.teacher?.description,
                is_super_tutor: item?.teacher?.is_super_tutor,
            })
        });

        return response;
    }
}

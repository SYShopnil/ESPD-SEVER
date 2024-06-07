/* eslint-disable */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateTeacherPassword } from '../dtos/teacher.dto';


@Injectable()
export class TeacherService {
    constructor(
        private readonly prismaService: PrismaService
    ) {
    }


    //get all teachers
    async GetAllTeacher(defaultOptions) {
        const page = Number(defaultOptions?.page) || 1;
        const perPage = Number(defaultOptions.perPage) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;

        const [total, data] = await Promise.all([
            this.prismaService.teacher.count({}),
            this.prismaService.teacher.findMany({
                skip,
                take: perPage,
                include: {
                    Review: true,
                    ExamBoardOnTeacher: {
                        include: {
                            ExamBoard: {
                                select: {
                                    logo: true
                                }
                            }
                        }
                    }
                },
            }),
        ]);

        for (const teacher of data) {
            teacher["reviewCount"] = teacher.Review.length;
            let totalRating = 0
            const allRat = teacher?.Review?.map(ebot => ebot.rating)
            for (let i = 0; i < allRat.length; i++) {
                totalRating += Number(allRat[i]);

            }
            // You can also remove the 'Review' property if you don't need it anymore
            teacher["totalRating"] = totalRating;
            delete teacher.Review;
        }

        for (const teacher of data) {

            // teacher["examBoardLogos"] = []
            // console.log(logos)
            const logos = teacher?.ExamBoardOnTeacher?.map(ebot => ebot?.ExamBoard?.logo)
            // const logosObj = logos.map(item => { logo: item })
            // You can also remove the 'Review' property if you don't need it anymore
            teacher["examBoardLogos"] = logos
            delete teacher?.ExamBoardOnTeacher;
            delete teacher?.password;
            delete teacher?.address_line_1;
            delete teacher?.address_line_2;
            delete teacher?.price_group;
            // delete teacher.price_one_to_one;
            delete teacher?.phone
            delete teacher?.is_dbs_checked
            delete teacher?.city
            delete teacher?.postal_code
            delete teacher?.country

        }

        const lastPage = Math.ceil(total / perPage);

        return {
            data,
            meta: {
                total,
                lastPage,
                currentPage: page,
                perPage,
                prev: page > 1 ? page - 1 : null,
                next: page < lastPage ? page + 1 : null,
            },
        };

    }

    //get single teacher
    async getTeacherById(id: number, user_id = null) {
        const teacher = await this.prismaService.teacher.findFirst({
            where: {id},
            include: {
                Review: {
                    include: {
                        student: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_photo: true,

                            }
                        }
                    }
                },
                ExamBoardOnTeacher: {
                    include: {
                        ExamBoard: {select: {id: true, logo: true, name: true}}
                    }
                },
                Qualification: true,
                SubjectOffered: {
                    include: {
                        Subject: {select: {name: true, id: true}},
                        Level: {
                            select: {
                                name: true,
                                id: true
                            }
                        },
                        Examboard: {
                            select: {
                                name: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });

        // console.log(first)
        // return teacher
        if (teacher === null) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }
        delete teacher['password'];

        const review = []
        teacher?.Review.map(item => {
            review.push({
                date: item?.date,
                rating: item?.rating,
                desc: item?.desc,
                profile_photo: item?.student_image,
                first_name: item?.student_name,
                last_name: ''
            })
        })
        teacher.Review = review

        const examBoardOnTeacher = []
        teacher?.ExamBoardOnTeacher.map(item => {
            examBoardOnTeacher.push({logo: item?.ExamBoard?.logo, id: item?.ExamBoard?.id, name: item?.ExamBoard?.name})
        })
        teacher.ExamBoardOnTeacher = examBoardOnTeacher


        const qualification = []
        teacher?.Qualification.map(item => {
            qualification.push({degree: item?.degree, subject: item?.subject})
        })
        teacher.Qualification = qualification

        const subjectOfferd = []
        teacher?.SubjectOffered?.map(item => {
            subjectOfferd.push({
                offerd_id: item?.id,
                name: item?.Subject?.name,
                id: item?.Subject?.id,
                level: item?.Level?.name,
                level_id: item?.level_id,
                subject_id: item?.subject_id,
                examboard_id: item?.Examboard?.id,
                examboard_name: item?.Examboard?.name,
            })
        })
        teacher.SubjectOffered = subjectOfferd

        const level_list = teacher?.SubjectOffered?.map(item => item?.level_id)
        const levelCost = await this.prismaService.levelCost.findMany({
            where: {level_id: {in: level_list}}, select: {
                cost_per_student: true,
                tutors_cut: true,
                no_of_member: true,
                level_id: true
            }
        });

        //if user is logged in, return a boolean specifying if the teacher is in user's favorite list
        let is_fav = false;
        if (user_id) {
            const check_fav = await this.prismaService.favorite.findFirst({
                where: {
                    teacher_id: id,
                    student_id: user_id
                }
            });
            is_fav = !!(check_fav);
        }

        return {
            ...teacher,
            is_favorite: is_fav,
            levelCost
        };
    }


    //teacher search
    async findAll(defaultOptions, where: any, user_id: null) {

        const page = Number(defaultOptions?.page) || 1;
        const perPage = Number(defaultOptions.perPage) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;
        const whereClause: any = {};
        let unique_teacher_ids = []
        let all_teacher_ids = []

        if (where.super_tutor === 'yes') {
            whereClause.is_super_tutor = true
        }
        if (where.tution_type !== null && where.tution_type !== undefined && where.tution_type !== '') {
            const tution_type = where?.tution_type
            console.log({tution_type})
            if(tution_type === "group"){
                whereClause.lesson_group = true
            }
            if(tution_type === "one_to_one"){
                whereClause.lesson_one_to_one = true
            }

        }
        if (where.free_video_call === "yes") {
            whereClause.free_video_call = true;
        }

        if (where.exam_board !== null && where.exam_board !== undefined && !isNaN(where.exam_board)) {
            const examBoard = await this.prismaService.examBoardOnTeacher.findMany({where: {exam_board_id: Number(where.exam_board)}})
            const teacher_ids = examBoard?.map(item => item?.teacher_id)
            all_teacher_ids.push(teacher_ids)
        }

        if (where.student_level !== null && where.student_level !== undefined && !isNaN(where.student_level)) {
            const levels = await this.prismaService.subjectOffered.findMany({where: {level_id: Number(where.student_level)}})
            const teacher_ids = levels?.map(item => item.teacher_id)
            all_teacher_ids.push(teacher_ids)
        }

        if (where.subject_id !== null && where.subject_id !== undefined && !isNaN(where.subject_id)) {
            const subjects = await this.prismaService.subjectOffered.findMany({where: {subject_id: Number(where.subject_id)}})
            const teacher_ids = subjects?.map(item => item.teacher_id)
            all_teacher_ids.push(teacher_ids)
        }

        if (where.availability !== null && where.availability !== undefined && where.availability !== '') {
            const availability = where?.availability
            const availiblityArr = availability.split('|')
            const daysArr = []
            const hoursArr = []

            availiblityArr.map(item => {
                if (item.includes("_none")) {
                    const itemDays = item.split("_none")
                    daysArr.push(itemDays[0])
                } else {
                    const itemHours = item.split("_")
                    hoursArr.push(itemHours)
                }

            })
            const filterCriteria = this.getPrismaFilterForSlots(hoursArr);
            const calendars = await this.prismaService.teacherCalender.findMany({
                where: {
                    OR: filterCriteria
                },
            });
            const teacher_ids = calendars?.map(item => item.teacher_id)
            all_teacher_ids.push(teacher_ids)

        }

        // if (where.tution_type !== null && where.tution_type !== undefined && !isNaN(where.tution_type)) {
        //     const tution_type = where?.tution_type
        //     if(tution_type === ""){

        //     }
        //     const levels = await this.prismaService.subjectOffered.findMany({where: {level_id: Number(where.student_level)}})
        //     const teacher_ids = levels?.map(item => item.teacher_id)
        //     all_teacher_ids.push(teacher_ids)
        // }




        unique_teacher_ids = this.findCommonElements(all_teacher_ids)

        if (where.hours || where.day || where.student_level || where.exam_board || where.subject_id || where.availability) {
            whereClause.id = {in: unique_teacher_ids}
        }


        const [total, data] = await Promise.all([
            this.prismaService.teacher.count({where: whereClause}),
            this.prismaService.teacher.findMany({
                where: whereClause,
                skip,
                take: perPage,

                include: {
                    Review: true,
                    ExamBoardOnTeacher: {
                        include: {
                            ExamBoard: {
                                select: {
                                    logo: true
                                }
                            }
                        }
                    }
                },
            }),
        ]);


        for (const teacher of data) {
            teacher["reviewCount"] = teacher.Review.length;
            let totalRating = 0
            const allRat = teacher?.Review?.map(ebot => ebot.rating)
            for (let i = 0; i < allRat.length; i++) {
                totalRating += Number(allRat[i]);

            }
            // You can also remove the 'Review' property if you don't need it anymore
            teacher["totalRating"] = totalRating;
            delete teacher.Review;
        }

        for (const teacher of data) {

            // teacher["examBoardLogos"] = []
            // console.log(logos)
            const logos = teacher?.ExamBoardOnTeacher?.map(ebot => ebot?.ExamBoard?.logo)
            // const logosObj = logos.map(item => { logo: item })
            // You can also remove the 'Review' property if you don't need it anymore
            teacher["examBoardLogos"] = logos
            delete teacher?.ExamBoardOnTeacher;
            delete teacher?.password;
            delete teacher?.address_line_1;
            delete teacher?.address_line_2;
            delete teacher?.price_group;
            // delete teacher.price_one_to_one;
            delete teacher?.phone
            delete teacher?.is_dbs_checked
            delete teacher?.city
            delete teacher?.postal_code
            delete teacher?.country

        }
        // const examBoardLogos = data.map(teacher => teacher.ExamBoardOnTeacher.map(ebot => ebot.ExamBoard.logo));
        // console.log({ examBoardLogos })
        const lastPage = Math.ceil(total / perPage);

        //if user id is passed, return array of favorite teacher's id for that user
        let fav_teachers = [];
        if (user_id) {
            const fav = await this.prismaService.favorite.findMany({
                where: {student_id: user_id}
            });
            fav?.map(i => fav_teachers.push(i.teacher_id));
        }

        return {
            data,
            fav_teachers,
            meta: {
                total,
                lastPage,
                currentPage: page,
                perPage,
                prev: page > 1 ? page - 1 : null,
                next: page < lastPage ? page + 1 : null,
            },
        };
    }


    async updateTeacherInfo(data, id: number) {
        const teacher = await this.prismaService.teacher.findFirst({where: {id: id}})
        if (teacher == null) {
            throw new HttpException("failed", HttpStatus.NOT_ACCEPTABLE)
        }
        const update_teacher = await this.prismaService.teacher.update({
            where: {id: id},
            data
        })
        delete update_teacher["password"]
        return update_teacher
    }

    async updateTeacherPassword(id: number, payload: UpdateTeacherPassword) {
        const teacher = await this.prismaService.teacher.findFirst({where: {id: id}})
        if (teacher == null) {
            throw new HttpException("you are not here", HttpStatus.BAD_REQUEST)
        }
        const hash = await bcrypt.hash(payload.new_password.toString(), 10)
        const update_teacher = await this.prismaService.teacher.update({
            where: {id: id},
            data: {
                password: hash
            }
        })
        delete update_teacher["password"]
        return update_teacher;
    }


    findCommonElements(arrays) {
        if (arrays.length === 0) {
            return [];
        }

        // Create a Set from the first array to store common elements
        const commonElements = new Set(arrays[0]);

        // Iterate through the remaining arrays
        for (let i = 1; i < arrays.length; i++) {
            const currentArray = arrays[i];
            const currentSet = new Set(currentArray);

            // Use the intersection operation to find common elements
            for (const element of commonElements) {
                if (!currentSet.has(element)) {
                    commonElements.delete(element);
                }
            }
        }

        // Convert the Set back to an array
        const commonElementsArray = Array.from(commonElements);

        return commonElementsArray;
    }

    /*
    * this funciton will return an array of Prisma specific filter criteria for a given slots by day
    *
    * hoursArr:
    *  hoursArr: [
        [0]     [ 'Monday', 'morning' ],
        [0]     [ 'Monday', 'afternoon' ],
        [0]     [ 'Tuesday', 'morning' ]
        [0]
     *  ]

*
* output:
*
* [
                    {
                        AND: [
                            {
                                day: 'Monday'
                            },
                            {
                                start_time: {
                                    lte: '9:00 am', // Check if start_time is less than or equal to searchTime.
                                },
                            },
                            {
                                end_time: {
                                    gte: '9:00 am', // Check if end_time is greater than or equal to searchTime.
                                },
                            },
                        ],
                    },

                    {
                        AND: [
                            {
                                day: 'Friday'
                            },
                            {
                                start_time: {
                                    lte: '9:00 am', // Check if start_time is less than or equal to searchTime.
                                },
                            },
                            {
                                end_time: {
                                    gte: '9:00 am', // Check if end_time is greater than or equal to searchTime.
                                },
                            },
                        ],
                    },
                ]
    * */
    private getPrismaFilterForSlots(hoursArr: any[]) {

        const output = [];

        hoursArr.map( day => {
            const [start, end] = this.getTimeRangeBySlotName(day[1]);
            output.push({
                AND: [
                    {
                        day: day[0]
                    },
                    {
                        start_time: {
                            gte: start, // Check if start_time is less than or equal to searchTime.
                        },
                    },
                    {
                        end_time: {
                            lte: end, // Check if end_time is greater than or equal to searchTime.
                        },
                    },
                ],
            })
        })

        return output;

    }

    private getTimeRangeBySlotName(slot: any) {
        if (slot === 'morning') {
            return ['9:00 am', '12:00 pm']
        }
        if (slot === 'afternoon') {
            return ['12:00 pm', '4:00 pm']
        }
        if (slot === 'afternoon') {
            return ['4:00 pm', '7:00 pm']
        }
    }
}

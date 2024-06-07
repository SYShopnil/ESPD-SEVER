import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {BookingStatus} from "@prisma/client";

@Injectable()
export class TeacherDashboardService {
    constructor(private readonly prismaService: PrismaService) { }


    async getBookingList(id: number, type: string) {
        const currentDate = new Date();
        const addHours = new Date(currentDate);
        addHours.setHours(currentDate.getHours() + 5);
        console.log('cur t', currentDate);
        console.log('ad t', addHours);
        await this.prismaService.booking.updateMany({
            where: {
                teacher_id: Number(id),
                end_time: {
                    gte: addHours
                },
                status: BookingStatus.UPCOMING
            },
            data: {
                status: BookingStatus.COMPLETE
            }
        });

        const booking = await this.prismaService.booking.findMany({
            where: {
                teacher_id: Number(id),
                status: {
                    not: BookingStatus.PAYMENT_PENDING
                }
            },
            orderBy: {
                start_time: 'asc'
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_photo: true
                    },
                },
                Subject: {
                    select: {
                        name: true
                    }
                },
                Level: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (booking === null) {
            throw new HttpException("no lessons", HttpStatus.NOT_FOUND)
        }
        const upcoming = booking.filter(item => item?.status === BookingStatus.UPCOMING)
        const complete = booking.filter(item => item?.status === BookingStatus.COMPLETE)

        return { upcoming, complete }
    }


    async getBooking(id: number, type: string) {
        const booking = await this.prismaService.booking.findMany({ where: { teacher_id: id } })
        if (booking === null) {
            throw new HttpException("no lessons", HttpStatus.NOT_FOUND)
        }
        let fileter_booking = []

        const date = new Date()

        const current_time = date.getTime()
        booking.map((item) => {
            if (type === "upcoming" && current_time < item?.date.getTime()) {
                fileter_booking.push(item)
                console.log(type)
            }
            else if (type === "completed" && current_time > item?.date.getTime()) {
                fileter_booking.push(item)
                console.log(type)
            }
            else {
                console.log("all")
                fileter_booking = []
            }
        })
        return fileter_booking
    }

}

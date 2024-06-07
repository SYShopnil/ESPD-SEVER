import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import {BookingStatus} from "@prisma/client";

@Injectable()
export class StudentDashboardService {
    constructor(private readonly prismaService: PrismaService) { }

    async getBooking(id: number) {
        // mark all past bookings as complete
        const currentDate = new Date();
        const addHours = new Date(currentDate);
        addHours.setHours(currentDate.getHours() + 5);
        console.log('cur', currentDate);
        console.log('ad', addHours);
        await this.prismaService.booking.updateMany({
            where: {
                student_id: id,
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
                student_id: id,
                status: {
                    not: BookingStatus.PAYMENT_PENDING
                }
            },
            orderBy: {
                start_time: 'asc'
            },
            include: {
                Level: {
                    select: {
                        name: true
                    }
                },
                Subject: {
                    select: {
                        name: true
                    }
                },
                Teacher: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_photo: true
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

}

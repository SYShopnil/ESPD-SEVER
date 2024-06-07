import { PrismaService } from '../../prisma/prisma.service';
import { BookingDtoGroup, BookingDtoSingle } from '../dtos/booking.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from "date-fns";
import EmailService from "../../email/email.service";
import SmsService from '../../email/sms.service';
import {BookingStatus, BookingTypes} from '@prisma/client';
import {DateTime} from "luxon";
const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


@Injectable()
export class BookingService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService,
        private readonly smsService: SmsService,
    ) { }

    async oneToOneBookingCreate(data: BookingDtoSingle) {
        //calculate price based on level, student count & duration
        const getPrice = await this.getBookingPrice(1, data.duration, data.level_id, data.teacher_id);
        // @ts-ignore
        const end_time = new Date((new Date(data.start_time)).getTime() + (Number(data?.duration) * 60 * 60 * 1000));
        const booking = await this.prismaService.booking.create({
            data: {
                ...data,
                end_time,
                amount: getPrice.price,
                teacher_amount: getPrice.teachers_cut
            },
            include: {
                Teacher: {
                    select: {
                        first_name: true,
                        last_name: true,
                        bio: true,
                        email: true,
                        profile_photo: true
                    }
                },
                Student: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                    }
                },
                Level: {
                    select: {
                        name: true
                    }
                },
                Subject: {
                    select: {
                        name: true
                    }
                }

            }
        })

        if (booking === null) {
            throw new HttpException("booking failed", HttpStatus.EXPECTATION_FAILED)
        }

        return {
            ...booking,
            is_booking: true,
            payment_url: ''
        }
    }

    async createBookingStudent(group, student_id: number) {
        const bookingStudent = await this.prismaService.booking.create({
            data: {
                teacher_id: group?.teacher_id,
                student_id: student_id,
                subject_id: group?.subject_id,
                level_id: group?.level_id,
                exam_board_id: group?.exam_board_id,
                booking_type: group?.booking_type,
                start_time: group?.start_time,
                duration: group?.duration,
                amount: group?.amount,
                suuport_message: group?.suuport_message,
                no_of_member: group?.no_of_member,
                meet_link: group?.meet_link,
                token: group?.token,
                parent_booking_id: group?.id
                // ex: group?.exam_board_id
            }
        })

        if (bookingStudent === null) {

            throw new HttpException("memeber creation", HttpStatus.EXPECTATION_FAILED)
        }
        return bookingStudent
    }

    async groupBookingCreate(data: BookingDtoGroup) {

        data.token = uuidv4();
        data.booking_type = "One_To_Group"
        const getPrice = await this.getBookingPrice(data.no_of_member, data.duration, data.level_id, data.teacher_id);
        const end_time = new Date((new Date(data.start_time)).getTime() + (Number(data?.duration) * 60 * 60 * 1000));
        const booking = await this.prismaService.booking.create({
            data: {
                ...data,
                end_time,
                amount: getPrice.price,
                teacher_amount: getPrice.teachers_cut
            },
            include: {
                Teacher: {
                    select: {
                        first_name: true,
                        last_name: true,
                        bio: true,
                        email: true,
                        profile_photo: true
                    }
                },
                Student: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                    }
                },
                Level: {
                    select: {
                        name: true
                    }
                },
                Subject: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (booking === null) {
            throw new HttpException("booking failed", HttpStatus.EXPECTATION_FAILED)
        }
        return {
            ...booking,
            is_booking: true,
            payment_url: '',
            join_link: ''
        }
    }


    createGroupBookingJoinLink(data) {
        const link = `${process.env.WEBSITE_BASE_URL}/join-group?auth_token=${data?.token}`
        return link
    }


    async verifyGroup(token) {
        const group = await this.prismaService.booking.findFirst({
            where: { token: token }, include: {
                Teacher: {
                    select: {
                        first_name: true,
                        last_name: true,
                        bio: true,
                        email: true,
                        profile_photo: true
                    }
                },
                Student: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                    }
                },
                Level: {
                    select: {
                        name: true
                    }
                },
                Subject: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (group === null) {
            throw new HttpException("not valid", HttpStatus.NOT_FOUND)
        }

        // check if max student has joined
        const userCount = await this.prismaService.bookingMember.count({
            where: {
                booking_id: group?.id
            }
        });
        if (userCount >= group?.no_of_member) {
            throw new HttpException("Cannot join group. Max members reached", HttpStatus.BAD_REQUEST)
        }

        return { ...group, is_verified: true, payment_url: "" }

    }


    async createGroupMember(student_id, group_id) {
        const member = await this.prismaService.bookingMember.create({
            data: {
                student_id: student_id,
                booking_id: group_id
            }
        })

        if (member === null) {
            throw new HttpException("not acceepted", HttpStatus.NOT_ACCEPTABLE)
        }
        return member
    }


    async verifyStudent(id) {
        const verify = {
            is_verified: false,
        }
        const student = await this.prismaService.student.findFirst({ where: { id } })
        if (student === null) {
            throw new HttpException("you are not valid", HttpStatus.NOT_FOUND)
        }

        verify.is_verified = true
        return { ...verify, student_email: student.email }
    }

    // async getBooking(id: number, type: string) {
    //     const booking = await this.prismaService.booking.findMany({ where: { teacher_id: id } })
    //     if (booking === null) {
    //         throw new HttpException("no lessons", HttpStatus.NOT_FOUND)
    //     }
    //     let fileter_booking = []

    //     const date = new Date()

    //     const current_time = date.getTime()
    //     booking.map((item) => {
    //         if (type === "upcoming" && current_time < item?.date.getTime()) {
    //             fileter_booking.push(item)
    //             console.log(type)
    //         }
    //         else if (type === "completed" && current_time > item?.date.getTime()) {
    //             fileter_booking.push(item)
    //             console.log(type)
    //         }
    //         else {
    //             console.log("all")
    //             fileter_booking = []
    //         }
    //     })
    //     return fileter_booking
    // }

    async getBooking(model: string, id: number) {
        const booking = await this.prismaService.booking.findMany({
            where: { [model + "_id"]: id },
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
        const currentDate = new Date()
        const upcoming = booking.filter(item => item?.date?.getTime() > currentDate.getTime())
        const complete = booking.filter(item => item?.date?.getTime() < currentDate.getTime())

        return { upcoming, complete }
    }

    async getTimeSlots(teacher_id: number, duration) {
        //mark all past bookings as complete
        await this.prismaService.booking.updateMany({
            where: {
                teacher_id: teacher_id,
                end_time: {
                    lte: new Date()
                },
                status: BookingStatus.UPCOMING
            },
            data: {
                status: BookingStatus.COMPLETE
            }
        });

        //get teacher's upcoming bookings so that we can disable those slots
        const teacherBookings = await this.prismaService.booking.findMany({
            where: {
                teacher_id: teacher_id,
                status: BookingStatus.UPCOMING
            }
        })

        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 15); // Generate slots for the next 30 days
        const timeSlots = [];
        const calendar = await this.prismaService.teacherCalender.findMany({
            where: {
                teacher_id
            }
        });

        let loopIndex = 0;
        while (today < endDate) {
            const weekStartDate = new Date(today);
            const weekEndDate = new Date(today);
            weekEndDate.setDate(weekStartDate.getDate() + 6); // End of the week is 6 days ahead
            const weekLabel = `${weekStartDate.getDate()} ${monthNames[weekStartDate.getMonth()]} - ${weekEndDate.getDate()} ${monthNames[weekEndDate.getMonth()]}`;
            const weekDays = [];

            for (let i = 0; i < 7; i++) {
                //TODO when generating slots for current date(today), skip the slots which has alraedy passed
                const day = new Date(today);
                day.setDate(today.getDate() + i);
                const dayLabel = `${day.toDateString().substring(0, 3)} ${day.getDate()}`;
                const slots = this.generateSlots(day, calendar, (loopIndex === 0 && i === 0), teacherBookings);
                weekDays.push({ day: dayLabel, slots });
            }

            timeSlots.push({ label: weekLabel, days: weekDays });
            today.setDate(today.getDate() + 7); // Move to the next week
            loopIndex += 1;
        }

        return timeSlots;

    }


    generateSlots(day, calendar, isToday, teacherBookings) {
        const interval = 30; // 30-minute intervals
        const day_name = days[day.getDay()]
        const slots = [];

        // const calendar_slot = calendar.find(i => i.day === day_name);
        const calendar_slots = calendar.filter(i => i.day === day_name);
        calendar_slots.map(slot => {
            let startTime = this.minutesFromMidnight(slot?.start_time);
            if (isToday) {
                const now = new Date();
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();
                const currentTime = (currentHours * 60 + currentMinutes) + 60; //TODO temporary fix, server is in UTC but project running in London(UTC+1), adding 1 hour to match it
                // change it later to handle timezone properly
                if (currentTime > startTime) {
                    startTime = this.findNextDivisibleBy30(currentTime);
                }
            }

            let endTime = this.minutesFromMidnight(slot?.end_time);
            if (endTime > 60) {
                endTime = endTime - 60; //exclude last 1 hour because minimum booking time is 1 hour
            }

            for (let time = startTime; time <= endTime; time += interval) {
                const hours = Math.floor(time / 60).toString().padStart(2, '0');
                const minutes = (time % 60).toString().padStart(2, '0');
                const timeLabel = `${hours}:${minutes}`;
                const dateTime = new Date(day);
                dateTime.setHours(Math.floor(time / 60));
                dateTime.setMinutes(time % 60);
                const only_date = this.formatDateToMySQLDate(dateTime);

                const isSlotBooked = this.findIfSlotBooked(dateTime, teacherBookings);

                // slots.push({ label: timeLabel, time: dateTime, id: uuidv4() });
                slots.push({
                    label: timeLabel,
                    time: `${only_date} ${timeLabel}:00`,
                    is_booked: isSlotBooked,
                    id: uuidv4()
                });
            }
        })

        // console.log({calendar_slot});
        // if (calendar_slot === undefined || calendar_slot === null) return slots;

        return slots;
    }

    findNextDivisibleBy30(number) {
        // Calculate the remainder when dividing the number by 30
        const remainder = number % 30;

        // If the remainder is 0, the number is already divisible by 30
        if (remainder === 0) {
            return number;
        } else {
            // Calculate the next multiple of 30 by adding the difference to the number
            const nextDivisibleBy30 = number + (30 - remainder);
            return nextDivisibleBy30;
        }
    }

    minutesFromMidnight(timeString) {
        // Split the time string into hours, minutes, and am/pm parts
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        // Calculate the total minutes
        let totalMinutes = (hours % 12) * 60 + minutes;

        // Adjust for AM/PM
        if (period === 'pm') {
            totalMinutes += 12 * 60;
        }

        return totalMinutes;
    }

    formatDateToMySQLDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }


    generateTimeSlots(/*day, */startTime, endTime, sessionDuration) {
        const timeSlots = []; // initialize an empty array for time slots
        // const sessionDuration = 45; // session duration in minutes

        // convert start and end times to Date objects
        const start = startTime/*new Date(1970-01-01T${startTime}:00.000Z)*/;
        const end = endTime/*new Date(1970-01-01T${endTime}:00.000Z)*/;
        // console.log({start});
        // console.log({end});

        // iterate over time range in 45 minute increments
        for (let i = start; i <= end; i?.setMinutes(i?.getMinutes() + sessionDuration)) {
            // console.log({i});

            const d = `${i?.getUTCFullYear()}-${String(i?.getUTCMonth() + 1).padStart(2, '0')}-${String(i?.getUTCDate()).padStart(2, '0')} ${String(i?.getUTCHours()).padStart(2, '0')}:${String(i?.getUTCMinutes()).padStart(2, '0')}:00`;
            //convert js date to mysql datetime format
            // const date = i.split('T')[0];
            // console.log({i});
            // const time = i.split('T')[1];
            // const d = ${date} ;
            // const d = ${date} ${time};
            // console.log({d});
            const timeSlot = {
                // day: day,
                start: d,
                duration: sessionDuration,
                // start: i.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                // end: new Date(i.getTime() + sessionDuration*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            timeSlots.push(timeSlot); // add time slot to array
        }

        return timeSlots;
    }

    // console.log(convertTo24HourFormat('7:00 am'));   // Output: 7
    // console.log(convertTo24HourFormat('8:15 am'));   // Output: 8
    // console.log(convertTo24HourFormat('6:00 pm'));   // Output: 18
    //https://chat.openai.com/share/5d081151-9989-4ab4-a9ee-6ac868d6d189
    convertTo24HourFormat = (timeString) => {
        // Split the input string into parts
        const parts = timeString.split(' ');

        // Extract the hour and minute components
        const timeComponents = parts[0].split(':');
        let hour = parseInt(timeComponents[0]);
        const minute = parseInt(timeComponents[1]);

        // Determine if it's AM or PM and adjust the hour accordingly
        if (parts[1] === 'pm' || parts[1] === 'PM') {
            if (hour !== 12) {
                hour += 12;
            }
        } else if (hour === 12) {
            hour = 0; // Midnight in 24-hour format
        }

        return hour;
    }



    async updateMeetLink(link, bookingTeacher) {
        const booking = await this.prismaService.booking.findFirst({ where: { id: bookingTeacher?.id } })
        if (booking === null) {
            throw new HttpException("booking not found", HttpStatus.NOT_FOUND)
        }

        const update = await this.prismaService.booking.update({
            where: { id: Number(booking.id) },
            data: {
                meet_link: link
            },
            include: {
                Teacher: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                        phone: true
                    }
                },
                Student: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                        phone: true
                    }
                },
                Subject: true,
                Level: true,
                ExamBoard: true
            }
        })

        return update

    }

    private async getBookingPrice(member_count: number, duration: number, level_id: number, teacher_id: number) {
        const teacher = await this.prismaService.teacher.findFirst({
            where: {
                id: teacher_id
            }
        });
        if (teacher === null) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        let unitCost = member_count === 1 ? teacher?.price_one_to_one : teacher?.price_one_to_one;
        let teachersCut = 10;
        const levelCost = await this.prismaService.levelCost.findFirst({
            where: {
                no_of_member: member_count,
                level_id
            }
        });
        if (levelCost) {
            unitCost = levelCost.cost_per_student;
            teachersCut = levelCost.tutors_cut
        }

        return {
            price: unitCost * duration,
            teachers_cut: teachersCut * duration
        }
    }

    private formatDate (date, tz = 'Etc/UTC', format = 'dd MMM, yyyy') {
        if (date === null || date === undefined || date === '' ) return '';

        return DateTime.fromISO(date).setZone(tz).toFormat(format);
    }

    private findIfSlotBooked(dateTime: Date, teacherBookings) {
        // console.log({dateTime});
        if (teacherBookings === null || teacherBookings === undefined) return false;
        let isBooked = false;
        teacherBookings?.map(item => {
            // console.log('st', item?.start_time);
            if (dateTime >= item?.start_time && dateTime <= item?.end_time) {
                isBooked = true;
            }
        });
        return isBooked;
    }
}

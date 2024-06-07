import { BookingService } from '../services/booking.service';
import { Post, Controller, Body, Get, Param, Query, HttpStatus, HttpException, Request, Res, Req } from '@nestjs/common';
import { BookingDtoGroup, BookingDtoSingle } from '../dtos/booking.dto';
import { res } from '../../common/response.helper';
import { StripeService } from '../services/stripe.service';
import { request } from 'http';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Controller('booking/teacher')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly stripeService: StripeService,
    ) { }

    @Post('one_to_one')
    async oneToOneBookingCreate(@Body() data: BookingDtoSingle) {
        const response = await this.bookingService.oneToOneBookingCreate(data)
        const payment = await this.stripeService.createSessionSingle(response?.id, response?.amount, response?.Teacher, response?.Student, response?.Level?.name, response?.Subject?.name,response?.booking_type);
        response.payment_url = payment.url
        return res.success(response, "success")
    }


    @Post('group')
    async createBookingGroup(@Body() data: BookingDtoGroup) {
        const response = await this.bookingService.groupBookingCreate(data)
        const createMembers = await this.bookingService.createGroupMember(response?.student_id, response?.id)
        const join_link = await this.bookingService.createGroupBookingJoinLink(response)
        const payment = await this.stripeService.createSessionSingle(response?.id, response?.amount, response?.Teacher, response?.Student, response?.Level?.name, response?.Subject?.name,response?.booking_type);
        response.payment_url = payment.url
        response.join_link = join_link
        return res.success(response, "success")
    }

    @Get("join-group")
    async joingroup(@Query("auth_token") auth_token: string, @Query("student_id") student_id: number) {
        const verify_group = await this.bookingService.verifyGroup(auth_token)
        const createMembers = await this.bookingService.createGroupMember(student_id, verify_group?.id)
        const createBookingStudent = await this.bookingService.createBookingStudent(verify_group, student_id)
        const payment = await this.stripeService.createSessionGroup(auth_token, createBookingStudent?.amount, createBookingStudent?.id, verify_group?.Teacher, verify_group?.Student, verify_group?.Level?.name, verify_group?.Subject?.name);
        verify_group.payment_url = payment?.url
        return res.success(verify_group, "verified")
    }

    @Get("timeslots")
    async getTimeSlots(@Query('id') teacher_id: number, @Query('duration') duration: number) {
        const response = await this.bookingService.getTimeSlots(teacher_id, duration)
        return res.success(response)
    }


}

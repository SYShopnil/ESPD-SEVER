import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PaymentStatus, BookingStatus, BookingTypes } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {

    constructor(private readonly prismaService: PrismaService) { }

    async createSessionSingle(id, amount: number, teacher, student, level, subject, booking_type) {
        const session = await this.createStripeSession(amount, id, teacher, student, level, subject, booking_type)

        return session
    }




    async createSessionGroup(token, amount, booking_id, teacher, student, level, subject) {
        const session = await this.createStripeSession(amount, booking_id, teacher, student, level, subject, "Group")
        return session
    }


    constructEvent(body, sig, endpointSecret) {
        return stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }

    // checking(data, sig) {
    //     const endpointSecret = process.env.STRIPE_SECRET_KEY;
    //     try {

    //         event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
    //     } catch (err) {
    //         return err
    //     }

    //     // Handle the event
    //     switch (event.type) {
    //         case 'payment_intent.succeeded':
    //             const paymentIntentSucceeded = event.data.object;
    //             // Then define and call a function to handle the event payment_intent.succeeded
    //             break;
    //         // ... handle other event types
    //         default:
    //             console.log(`Unhandled event type ${event.type}`);
    //     }
    // }

    async createStripeSession(amount, booking_id, teacher, student, level, subject, booking_type) {
        const totalAmount = Number(amount) * 100
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {

                    price_data: {
                        unit_amount: totalAmount,
                        currency: process.env.CURRENCY,
                        product_data: {
                            // name: `${teacher?.first_name + " " + teacher?.last_name}`,
                            // images: [
                            //     `${teacher?.profile_photo}`,
                            // ],
                            name: `Lesson with ${teacher?.first_name} ${teacher?.last_name}`,
                            images: [
                                `${teacher?.profile_photo}`,
                            ],
                            description: `${subject} (${level})`,
                        },
                    },
                    quantity: 1,

                },

            ],
            payment_intent_data: {
                metadata: {
                    Service: `${level} ${subject} ${booking_type === BookingTypes.One_To_One ? "1:1" : booking_type} Tutorial`,
                    Customer: `${student?.first_name} ${student?.last_name}`,
                    Price: amount,
                    booking_id: booking_id,
                },
            },
            mode: 'payment',
            client_reference_id: booking_id,
            customer_email: `${student?.email}`,
            success_url: `${process.env.WEBSITE_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.WEBSITE_BASE_URL}/payment-cancel`,
        });
        return session
    }

    async updatePaymentStatus(id: number) {
        const group = await this.prismaService.booking.findFirst({ where: { id: id } })
        if (group === null) {
            throw new HttpException("not valid", HttpStatus.NOT_FOUND)
        }

        const update_booking = await this.prismaService.booking.update({
            where: { id },
            data: {
                payment_status: PaymentStatus.PAID,
                status: BookingStatus.UPCOMING,
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
                ExamBoard: {
                    select: {
                        name: true
                    }
                },
                Teacher: {
                    select: {
                        email: true,
                        first_name: true,
                        last_name: true,
                        google_refresh_token: true,
                        google_access_token: true,
                    }
                },
                Student: {
                    select: {
                        email: true
                    }
                },
            }
        })

        return update_booking

    }
}

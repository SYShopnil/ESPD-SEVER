import { BookingService } from '../services/booking.service';
import { Controller, Headers, HttpCode, ParseEnumPipe, Post, RawBodyRequest, Req, Request } from '@nestjs/common';
import { res } from '../../common/response.helper';
import { StripeService } from '../services/stripe.service';
import { GoogleMeetService } from '../services/google-meet.service';
import { PaymentStatus } from '@prisma/client';
import { BookingNotificationService } from "../services/booking-notification.service";

@Controller('stripe')
export class StripeController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly stripeService: StripeService,
        private readonly googleMeetService: GoogleMeetService,
        private readonly bookingNotificationService: BookingNotificationService,

    ) { }

    /* stripe webhook*/
    @Post('webhook')
    @HttpCode(200)
    async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig) {
        const raw = req.rawBody; // returns a Buffer.
        let event;
        try {
            event = this.stripeService.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.log(`Webhook Error: ${err.message}`);
            return;
        }
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // console.log(paymentIntentSucceeded);
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            case 'charge.succeeded':
                const booking_id = event.data.object.client_reference_id || event.data.object.metadata.booking_id;
                const obj = event.data.object;
                const payment_method = obj.payment_method_details;
                console.log("from webhook call booking id ==>>>>>> ::: ",booking_id)
                let card_number = '';
                let card_brand = '';
                if (payment_method.type === 'card') {
                    card_brand = payment_method?.card?.brand;
                    card_number = payment_method?.card?.last4;
                }
                if (booking_id !== undefined && booking_id !== null) {
                    const verifyBooking = await this.stripeService.updatePaymentStatus(Number(booking_id))
                    if (verifyBooking?.payment_status === PaymentStatus.PAID) {
                        if (!verifyBooking.meet_link) {
                            const meet_link = await this.googleMeetService.create(verifyBooking)
                            const update_meet_link = await this.bookingService.updateMeetLink(meet_link, verifyBooking);
                            await this.bookingNotificationService.notifyAfterBooking(verifyBooking?.id, true, true);
                        } else {
                            await this.bookingNotificationService.notifyAfterBooking(verifyBooking?.id, false, true);
                        }
                    }
                }
                break;

            case 'charge.failed':
                const obj2 = event.data.object;
                // console.log({obj2});
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        // response.send();
        return res.success({}, 200)
    }

    @Post('google/meet')
    async createMeetLink() {
        const verifyBooking = await this.stripeService.updatePaymentStatus(Number(65))
        if (verifyBooking?.payment_status === PaymentStatus.PAID) {
            const meet_link = await this.googleMeetService.create(verifyBooking)
            const update_meet_link = await this.bookingService.updateMeetLink(meet_link, verifyBooking)
            return update_meet_link
        }
        return
    }


}

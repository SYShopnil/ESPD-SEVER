import { google } from "googleapis";


export class GoogleMeetService {


    async create(booking) {
        if (!booking?.Teacher?.google_access_token ||
            !booking.Teacher?.google_refresh_token) {
            return null;
        }
        const calendar = google.calendar({ version: 'v3' });

        const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CALENDAR_CLIENT_ID, process.env.GOOGLE_CALENDAR_CLIENT_SECRET_KEY);
        oauth2Client.setCredentials(
            {
                access_token: booking.Teacher?.google_access_token,
                refresh_token: booking.Teacher?.google_refresh_token,
            });

        const start_time = new Date(booking?.start_time?.getTime() - 60) //TODO temp fix: meeting was created 1 hour later because of uct vs london timezone issue
        // const end_time = new Date(start_time?.getTime() + (Number(booking?.duration) * 60 * 60 * 1000));

        const event = {
            summary: `Lesson with ${booking?.Teacher?.first_name + " " + booking?.Teacher?.last_name}`,
            description: `${booking?.Subject?.name + "(" + booking?.Level?.name})`,
            start: {
                dateTime: booking?.start_time?.toISOString(),
                timeZone: 'Etc/UTC'
            },
            end: {
                dateTime: booking?.end_time?.toISOString(),
                timeZone: 'Etc/UTC'
            },
            conferenceData: {
                createRequest: {
                    requestId: this.makeid(10),
                },
            },
            attendees: [
                { email: `${booking.Teacher?.email}` },
                { email: `${booking.Student?.email}` },
            ]
        };

        let res;
        try {
            res = await calendar.events.insert({
                    auth: oauth2Client,
                    calendarId: 'primary', // User's primary calendar
                    requestBody: event,
                    conferenceDataVersion: 1,
                });
        } catch (e) {
            console.log({e});
            console.log('Failed to create meet link for booking id: ', booking.id);
            return null;
        }

        console.log('ress', res);
        console.log('resssss', res?.data?.hangoutLink);
        return res?.data?.hangoutLink
    }

    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}

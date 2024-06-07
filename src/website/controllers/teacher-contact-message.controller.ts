import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ROLE_STUDENT, ROLE_TEACHER } from "../../common/constants";

import { res } from "src/common/response.helper";
import { MessageDto } from "../dtos/message.dto";
import { TeacherContactMessageService } from "../services/teacher-contact-message.service";
import EmailService from "../../email/email.service";



@Controller('student/contact')
export class TeacherContactMessageController {

    constructor(
        private readonly teacherContactMessageService: TeacherContactMessageService,
        private readonly emailService: EmailService
    ) { }

    @Post('teacher')
    async contactWithTeacher(@Body() data: MessageDto) {
        const response = await this.teacherContactMessageService.contactWithTeacher(data);
        const html = `<h3 style="text-align:center;">I’d like a free video chat with the teacher ? </br> <p style="text-align:center;">
      ${response?.free_video_chat ? "Yes" : "No"}
      </p> </h3>
      <div>
      <p>Message: ${response?.message}</p>
        <h3 style="margin:0;">
        => Would you want contact with me?
        </h3>
        <p style="margin:0;">
        => Contact Me : ${response?.contact_email}
        </p>
      </div>
      <div>
      <img src="${response?.ExamBoard?.logo}"  alt="${response?.ExamBoard?.name}">
        <p>${response?.ExamBoard?.name}</p>
      </div>
      `
        const send_email = await this.emailService.sendEmail(response?.Teacher?.email, `Contact with Teacher`, null, html)
        response.send_message = send_email.send_message
        return res.success(response, "success")
    }
}

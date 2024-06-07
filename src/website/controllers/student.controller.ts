import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ROLE_STUDENT, ROLE_TEACHER } from "../../common/constants";

import { UpdateStudentPassword } from "../dtos/student.dto";
import { StudentService } from "../services/student.service";
import { res } from "src/common/response.helper";



@Controller('student')

export class StudentController {

    constructor(private studentService: StudentService) { }

    @Post('update/info/:id')
    async updateStudentInfo(@Param('id') id: number, @Body() data) {
        const response = await this.studentService.updateStudentInfo(data, id);
        return res.success({ ...response, role: ROLE_STUDENT }, "update successful")
    }

    @Post('update/password/:id')
    async updateStudentPassword(@Param('id') id: number, @Body() data: UpdateStudentPassword) {
        const update_student = await this.studentService.updateStudentPassword(id, data)
        return res.success(update_student,"update success full")
    }
}

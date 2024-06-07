import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from "@nestjs/common";
import { StudentDashboardService } from "../services/student-dashboard.service";
import { res } from "src/common/response.helper";
import { StudentService } from "../services/student.service";
import { ROLE_STUDENT, ROLE_TEACHER } from "../../common/constants";
import { UpdateStudentPassword } from "../dtos/student.dto";
import { FavouriteService } from "../services/favourite.service";
import { FavouriteDto } from "../dtos/favourite.dto";
import {HasRoles} from "../../auth/jwt/has-roles.decorator";
import {Role} from "../../auth/dto/role.enum";
import {JwtAuthGuard} from "../../auth/jwt/jwt-auth.guard";
import {RolesGuard} from "../../auth/jwt/roles.guard";

@HasRoles(Role.Student)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student')
export class StudentDashboardCotroller {

    constructor(
        private readonly studentDashboardService: StudentDashboardService,
        private studentService: StudentService,
        private readonly favouriteService: FavouriteService
    ) { }

    @Get('dashboard/bookings')
    async getBooking(@Req() req) {
        const user = req.user;
        const student_id = user?.id
        const bookings = await this.studentDashboardService.getBooking(student_id)
        return res.success(bookings, "success")
    }//

    @Get('profile')
    async getProfile(@Req() req) {
        const user = req.user;
        const student = await this.studentService.getStudentById(user?.id)
        return res.success(student, "success");
    }

    @Post('update/info')
    async updateStudentInfo(@Body() data, @Req() req) {
        const user = req.user
        const id = user?.id
        const response = await this.studentService.updateStudentInfo(data, id);
        return res.success({ ...response, role: ROLE_STUDENT }, "update successful")
    }

    @Post('update/password')
    async updateStudentPassword(@Body() data: UpdateStudentPassword , @Req() req) {
        const user = req.user
        const id = user?.id
        const update_student = await this.studentService.updateStudentPassword(id, data)
        return res.success(update_student, "update success full")
    }

    @Get('favourite')
    async getFavouriteByStudentId(@Req() req ) {
        const user = req.user;
        const student_id = user?.id
        const teachers = await this.favouriteService.getFavouriteByStudentId(student_id)
        return res.success(teachers, "Success")
    }

}

import request from '@/utils/request'

export default {
    //添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
          })
    },
    //查询所有讲师
    getListTeacher() {
      return request({
        url: `/eduservice/teacher/findAll`,
        method: 'get'
      })
    },
    //根据courseId获取courseInfo信息
    getCourseInfo(courseId) {
      return request({
        url: `/eduservice/course/getCourseInfo/${courseId}`,
        method: 'get'
      })
    },
    //根据courseId获取courseInfo信息
    updateCourseInfo(courseInfoVo) {
      return request({
        url: `/eduservice/course/updateCourseInfo`,
        method: 'post',
        data:courseInfoVo
      })
    },
    //根据courseId获取课程发布信息
    getCoursePublishInfo(courseId) {
      return request({
        url: `/eduservice/course/getCoursePublish/${courseId}`,
        method: 'get'
      })
    },
    //发布课程
    coursePublish(courseId) {
      return request({
        url: `/eduservice/course/publishCourse/${courseId}`,
        method: 'post'
      })
    },
    //分页查询加提交
    getCourseListPage(current,limit,courseQuery) {
      return request({
          url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
          method: 'post',
          data: courseQuery
        })
    },
    deleteCourseById(courseId) {
      return request({
          url: `/eduservice/course/${courseId}`,
          method: 'delete'
        })
    }
  
}
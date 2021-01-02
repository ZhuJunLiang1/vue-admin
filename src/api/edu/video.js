import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data:video
          })
    },
    //修改小节
    updateVideo(video) {
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data:video
          })
    },
    //查询小节
    getVideo(videoId) {
        return request({
            url: `/eduservice/video/getVideo/${videoId}`,
            method: 'get'
          })
    },
    //删除小节
    deleteVideo(videoId) {
        return request({
            url: `/eduservice/video/${videoId}`,
            method: 'delete'
          })
    },
    //删除阿里云视频
    deleteAliVideo(id) {
        return request({
            url: `/eduvod/video/removeVideo/${id}`,
            method: 'delete'
          })
    },

}
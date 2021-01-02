import request from '@/utils/request'

export default {
    getBannerListPage(current,limit) {
        return request({
            url: `/educms/banneradmin/pageBanner/${current}/${limit}`,
            method: 'get'
          })
    },
    getBannerById(bannerId) {
        return request({
            url: `/educms/banneradmin/getBanner/${bannerId}`,
            method: 'get'
          })
    },
    addBanner(banner) {
        return request({
            url: `/educms/banneradmin/addBanner`,
            method: 'post',
            data:banner
          })
    },
    updateBanner(banner) {
        return request({
            url: `/educms/banneradmin/updateBanner`,
            method: 'put',
            data:banner
          })
    },
    deleteBanner(bannerId) {
        return request({
            url: `/educms/banneradmin/removeBanner/${bannerId}`,
            method: 'delete'
          })
    }

}
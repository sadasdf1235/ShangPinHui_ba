import request from '@/utils/request'
//删除Spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
//获取Spu基本信息进行数据展示
export const reqGetSpu = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
//修改||添加Spu
export const reqUpdateOrAddSpu = (data) => {
    if (data.id) {
        //修改SPu
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: data })
    } else {
        //添加Spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: data })
    }
}

//SpuForm组件获取Spu信息
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
//SpuForm组件获取品牌信息
export const reqTradeMark = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
//SpuForm skuForm组件获取图片信息
export const reqSpuImage = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
//SpuForm组件获取平台属性信息
export const reqSpuAttr = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })


//统一暴露4个模块
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
import * as trademark from './product/tradeMark'
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
export default {
    attr,
    sku,
    spu,
    trademark,
    user,
    role,
    permission
}
<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDiaLog"
      >添加</el-button
    >
    <!-- 
      表格组件
      data:表格组件将来需要展示的数据----数组类型
      border:是给表格添加边框
      column
      label:显示标题
      width:对应列的宽度
      align；标题的对齐方式
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    current-page 当前页
    page-size  每页多少条数据
    page-sizes  设置每一页展示多少条数据
    total  数据数
    layout 分页器的布局
    pager-count  连续页码数
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout=" prev, pager, next, jumper,->,sizes, total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- :model="tmForm" 收集表单数据 -->
      <el-form style="width=80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action 设置图片上传的地址
          on-success 当图片上传成功会执行一次
          before-upload 图片上传之前会执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //当前第几页
      page: 1,
      //每页展示多少条数据
      limit: 3,
      //服务器总数据
      total: 0,
      //列表展示的数据
      list: [],
      //控制对话框显示和隐藏
      dialogFormVisible: false,
      //收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //添加 修改品牌的表单验证
      rules: {
        // 品牌名称的验证
        tmName: [
          //required 必须要检验的字段 message提示的信息 trigger事件
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        // 品牌LOGO的验证
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    //获取列表数据
    this.getPageList();
  },
  methods: {
    //获取列表数据
    async getPageList(pager = 1) {
      //跳转到当前页
      this.page = pager;
      //获取数据
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当某页展示的数据条数发生变化时
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //显示对话框
    showDiaLog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //row 当前用户选中品牌的信息
      //需要进行浅拷贝row
      console.log(row);
      this.tmForm = { ...row };
    },
    //当图片上传成功会执行一次
    handleAvatarSuccess(res, file) {
      //res 是上传成功之后返回的数据
      //file 上传成功之后服务器返回的数据

      //收集品牌图片的数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前会执行一次
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确定按钮(上传品牌名称和LOGO的数据)
    addOrUpdateTradeMark() {
      this.$refs[formName].validate(async (successd) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息 修改|添加品牌成功
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            // 刷新列表
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("提交错误信息!!");
          return false;
        }
      });
    },
    //品牌管理删除按钮
    deleteTradeMark(row) {
      //弹出确认删除提示
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            //确定删除执行
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          //更新列表
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        })
        .catch(() => {
          // 取消删除执行
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
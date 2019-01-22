<template lang="pug">
    div#home
        div(class="btns")
            div(id="filePicker") 选择文件
            button(@click="uploadFile" class="btn btn-default") 开始上传
        ul(class="file-item" v-for="file in fileList")
            li(class="file-name") {{file.name}}
            li(class="file-size") {{fileSize(file.size)}}
        Progress(:percent="percent"
            :status="status" :stroke-width="15")
        VueUpload(ref="uploader"
            :url='uploadUrl' :fileNumLimit="fileNumLimit" :fileSingleSizeLimit="fileSingleSizeLimit"
            :formData="formData" uploadButton="#filePicker" @fileChange="fileChange"
            @progress="onProgress" @success="onSuccess" @error="onError" @uploadError="onUploadError")
</template>

<script>
    import VueUpload from './VueUpload'
    import {getConfig} from "../assets/js/config";
    import {getFakerData} from "../assets/js/faker-data";

    export default {
        name: "Home",
        components: {
            VueUpload
        },
        data() {
            return {
                fileList: [],
                percent: 0,
                status: 'active',
                uploadUrl: getConfig().remoteHost + "/demand/required/uploadFile",
                fileNumLimit: 2,
                fileSingleSizeLimit: 2*1024*1024*1024, //2G
                formData: {
                    uuid: "",
                    datePath: ""
                }
            }
        },
        created() {

        },
        computed: {
            uploader() {
                return this.$refs.uploader;
            }
        },
        methods: {
            uploadFile() {
                this.$refs.uploader.upload();
            },
            fileChange(file) {
                if (!file.size) return;
                this.percent = 0;
                while(this.fileList && this.fileList.length > 0){
                    let rmFile = this.fileList.shift();
                    this.remove(rmFile);
                }
                this.fileList.push(file);
            },
            remove(file) {
                // 取消并中断文件上传
                this.$refs.uploader.cancelFile(file);
                // 在队列中移除文件
                this.$refs.uploader.removeFile(file, true);
            },
            onProgress(file, percent) {
                this.percent = parseFloat(percent).toFixed(2) * 100;
            },
            onSuccess(file, response) {
                console.log('上传成功', response);
                if (response.status == "200") {
                    this.status = "success";
                } else {
                    this.status = "wrong";
                    let error = "文件上传失败！"
                    error += response.message;
                    alert(error);
                }
            },
            onError(errorMessage) {
                alert(errorMessage);
            },
            onUploadError( file, reason) {
                let error = "文件上传失败！"
                if(reason = 'http') {
                    error += "请确认是否有登录";
                }
                this.status = "wrong";
                alert(error);
            },
            fileSize(size) {
                return WebUploader.Base.formatSize(size);
            }
        }
    }
</script>

<style scoped lang="stylus">
    ul
        list-style none
        margin 0px
        padding 0px
        width auto
    ul li
        float left
        margin-left 20px
        font-size 15px
    #home
        width 50%
        margin auto 25%
</style>
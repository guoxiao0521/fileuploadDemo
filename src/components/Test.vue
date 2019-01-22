<template>
    <ul class="clearfix">
        <li v-if="imgs.length>0" v-for='(item ,index ) in imgs'>
            <img :src="item">
        </li>
        <li style="position:relative" v-if="imgs.length>=6 ? false : true">
            <img src="../../assets/img/addimg.png"><input class="upload" @change='add_img'  type="file">
        </li>
    </ul>
</template>

<script>
    export default {
        name: "Imageupload",
        data () {
            return {
                imgs: [],
                imgData: {
                    accept: 'image/gif, image/jpeg, image/png, image/jpg',
                }
            }
        },
        method:{
            add_img(event){
                let reader =new FileReader();
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                if(this.imgData.accept.indexOf(type) == -1){
                    alert('请选择我们支持的图片格式！');
                    return false;
                }
                if(size>3145728){
                    alert('请选择3M以内的图片！');
                    return false;
                }
                var uri = ''
                let form = new FormData();
                form.append('file',img1,img1.name);
                this.$http.post('/file/upload',form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    console.log(response.data)
                    uri = response.data.url
                    reader.readAsDataURL(img1);
                    var that=this;
                    reader.onloadend=function(){
                        that.imgs.push(uri);
                    }
                }).catch(error => {
                    alert('上传图片出错！');
                })
            },

        }

    }
</script>

<style scoped>

</style>
import { Injectable } from '@angular/core';
import { NativeService } from './native.service';



@Injectable()
export class ImagePreviewService {
    constructor(
        public nativeService:NativeService
    ){}

    /**
     * 读取文件
     * @param file  file
     */
    readAsDataUrl(file){
        
        //检查文件类型
        if(['png','jpeg','gif','jpg'].indexOf(file.type.split('/')[1]) < 0){
            // 自定义报错方式
            // Toast.error("文件类型仅支持 jpeg/png/gif！", 2000, undefined, false);
            this.nativeService.toast("文件仅支持 jpeg/jpg/png/gif!");
            return;
        }
        // 图片压缩之旅
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e:any)=>{
                resolve(e.target.result);
            },
            reader.onerror = ()=>{
                this.nativeService.toast("文件读取失败");
            }
        })
    }

    /**
     *图片压缩，并返回Blob数据
     *
     * @param {*} imgSrc
     * @returns
     * @memberof ImagePreviewService
     */
    compressImg(imgSrc,imgType){
        return new Promise((resolve,reject)=>{
            const img = new Image()
            img.src = imgSrc;
            img.onload = ()=>{
                 // 图片原始尺寸
                var originWidth = img.width;
                var originHeight = img.height;
                console.log(img.width+","+img.height);
                // 最大尺寸限制
                var maxWidth = 1000, maxHeight = 1000;
                // 目标尺寸
                var targetWidth = originWidth, targetHeight = originHeight;
                // 图片尺寸超过400x400的限制
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }

                // 缩放图片需要的canvas
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                    
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                
                /* canvas.toBlob((blob)=>{
                    resolve(blob)
                })  */
                const canvasDataUrl = canvas.toDataURL(imgType,0.5);
                resolve(canvasDataUrl);
            }
        })
    }


    uploadImg(imgBlobData){
        console.log(imgBlobData);
    }

    

}
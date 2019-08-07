import { Injectable } from '@angular/core';
import { ToastController , ToastOptions, AlertController } from 'ionic-angular';
/* import { Network } from '@ionic-native/network';
 */
@Injectable()
export class NativeService {

    constructor(
        public toastCtrl:ToastController,
        public alertCtrl:AlertController,
    ){

    }

    /**
     * toast弹窗
     * @param message 消息
     * @param duration 时间
     * @param position 位置
     */
    toast(message:string,duration:number=2000,position:string = 'top'){
        return new Promise((resolve)=>{
            const options:ToastOptions = {
                message:message,
                duration:duration,
                position:position
            }
            const toast = this.toastCtrl.create(options);
            toast.present();
            setTimeout(()=>{resolve()},duration);
        })
    }

    

    /**
     * 确认弹窗
     * @param title 
     * @param message 
     * @param cancleText 
     * @param activeText 
     * @param cancleCallBack 
     * @param activeCallBack 
     */
    confirm(message){
        return new Promise((resolve)=>{
            const confirm = this.alertCtrl.create({
                title:"提示",
                message:message,
                buttons:[
                    {
                        text:"取消",
                        handler:()=>{}
                    },
                    {
                        text:"确定",
                        handler:()=>{
                            resolve();
                        }
                    }
                ]
            });
            confirm.present();
        })
        
    }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
    /* getNetworkType():string{
        return this.network.type;
    } */

    /**
     * 判断是否有网络
     * @returns {boolean}
     */
    /* isConnecting(): boolean {
        return this.getNetworkType() != 'none';
    } */
}
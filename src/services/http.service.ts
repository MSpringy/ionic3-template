import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { NativeService } from './native.service';
import { Res } from "../modal/Res";

@Injectable()
export class HttpService {
    
     httpOptions = {
        headers:new HttpHeaders({
            'Content-type':'application/json',
        })
    }

    constructor(
        public http:HttpClient,
        public navtiveService:NativeService,
        @Inject("HTTP_URL") private httpUrl,
        public loadingCtrl: LoadingController
    ){}


    /**
     * post 请求
     * @param url 请求地址
     * @param parms 请求体
     * @param toastShow 是否显示toast弹窗，默认显示
     * @param loading 是否显示loading弹窗，默认不显示
     */
    post(url:string,parms:any={},toastShow:boolean = true,loading:boolean = false):Observable<any>{
        let loadPop:any;
        if(loading){
            loadPop = this.loadingCtrl.create({
                content: '加载中，请稍候',
            })
            loadPop.present();
        }
        const uri = this.httpUrl.uri+url;
        return Observable.create(observer=>{
            this.http.post(uri,parms,this.httpOptions)
                .pipe(catchError(this.handleError))
                .subscribe((success:Res)=>{
                    if(loading){
                        loadPop.dismiss();
                    }
                    if(this.requestSuc(success,toastShow)){
                        observer.next(success.data);
                    }
                },err=>{
                    console.log(err);
                    if(loading){
                        loadPop.dismiss();
                    }
                    this.navtiveService.toast(err);
                })
        })
    }

    /**
     * get 请求
     * @param url 请求地址
     * @param toastShow 是否显示toast弹窗，默认显示
     * @param loading 是否显示loading弹窗，默认不显示
     */
    get(url:string,toastShow:boolean = true,loading:boolean = false):Observable<any>{
        const uri = this.httpUrl.uri+url;
        let loadPop:any;
        if(loading){
            loadPop = this.loadingCtrl.create({
                content: '加载中，请稍候'
            })
            loadPop.present();
        }
        return Observable.create(observer=>{
            this.http.get(uri,this.httpOptions)
                .pipe(catchError(this.handleError))
                .subscribe(
                    (success:Res)=>{
                        if(loading){
                            loadPop.dismiss();
                        }
                        if(this.requestSuc(success,toastShow)){
                            observer.next(success.data);
                        }
                    },(err)=>{
                        if(loading){
                            loadPop.dismiss();
                        }
                        console.log(err);
                        this.navtiveService.toast(err);
                    }
                )
            })    
    }

    /**
     *处理请求响应为success的数据
     *
     * @param {*} data
     * @memberof HttpService
     */
    requestSuc(data,toastShow){
        if(data.code==200){
            if(JSON.stringify(data.data)=="{}"){
                if(toastShow){
                    this.navtiveService.toast(data.msg);
                }
                return "success";
            }else{
                return data.data;
            }
        }else{
            //code为错误码
            this.navtiveService.toast(data.msg);
        }
    }



    handleError(error: HttpErrorResponse) {
        let errMsg: string = '请求发生异常'; 
        let status = error.status;
        if (status === 0) {
            errMsg = '请求失败，请求响应出错';
        } else if (status === 404) {
            errMsg = '请求失败，未找到请求地址';
        } else if (status === 500) {
            errMsg = '请求失败，服务器出错，请稍后再试';
        }else {
            errMsg = error.statusText ? error.statusText : error.toString();
        }
        // return an observable with a user-facing error message
        return Observable.throw(errMsg);
      };

}
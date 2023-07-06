var configuration = require('../../config')
const debug = configuration.debugMode

class APIInvoker {

    getAPIHeader() {
        return {
            'Content-Type': 'application/json',
            authorization: 'Bearer '+window.localStorage.getItem("token"),
        }
    }

    getApiFileHeader() {
        return {
           // 'Content-Type': 'multipart/form-data',
            authorization: 'Bearer '+window.localStorage.getItem("token"),
        }
    }

    invokeDELETE(url, okCallback, failCallback) {
        let params = {
            method: 'delete',
            headers: this.getAPIHeader(),
        }
        this.invoke(url, okCallback, failCallback, params);
    }

    invokeDELETEBody(url, body, okCallback,  failCallback){
        let params={
            method: 'delete',
            headers: this.getAPIHeader(),
            body: JSON.stringify(body)
        }
        this.invoke(url, okCallback, failCallback, params)
    }

    invokeGET(url, okCallback, failCallback) {
        let params = {
            method: 'get',
            headers: this.getAPIHeader(),
        };
        this.invoke(url, okCallback, failCallback, params);
    }

 /*   invokeGET(url, body, okCallback, failCallback){  //Provisorio pero no sirvio
        let params = {
            method: 'get',
            headers: this.getAPIHeader(),
            body: JSON.stringify(body)
        }
        this.invoke(url, okCallback, failCallback, params);
    } */

    invokePUT(url, body, okCallback, failCallback) {
        let params = {
            method: 'put',
            headers: this.getAPIHeader(),
            body: JSON.stringify(body)
        };

        this.invoke(url, okCallback, failCallback, params);
    }

    invokePOST(url, body, okCallback, failCallback) {
        let params = {
            method: 'post',
            headers: this.getAPIHeader(),
            body: JSON.stringify(body)
        };

        this.invoke(url, okCallback, failCallback, params);
    }

    invoke(url, okCallback, failCallback, params) {
        if (debug) {
            console.log("Invoke => " + params.method + ":" + url);
            console.log(params.body);
        }

        fetch(`${configuration.server.host}:${configuration.server.port}${url}`,
            params)
            .then((response) => {
                if (debug) {
                    console.log("Invoke Response => ");
                    console.log(response);

                }
                return response.json()  //Esto es clave para entender como debe ser la respuesta del API
            })
            .then((responseData) => {
                if (responseData.ok) {
                    okCallback(responseData)
                } else {
                    failCallback(responseData)
                }
            })
    }

    invokeUpload(file, okCallback, failCallback) {
        let formData = new FormData();
    
        formData.append("file", file);
    
        let params = {
            method: 'POST',
            body: formData,
            headers: this.getApiFileHeader()
        }
        this.invoke('/icb-api/v1/uploads', okCallback, failCallback, params);
      }
    

    invokeUploadImg(img, okCallback, failCallback) {
        let formData = new FormData();
    
        formData.append("img", img);
    
        let params = {
            method: 'POST',
            body: formData,
            headers: this.getApiFileHeader()
        }
        this.invoke('/icb-api/v1/uploads/img', okCallback, failCallback, params);
      }
}
export default new APIInvoker();
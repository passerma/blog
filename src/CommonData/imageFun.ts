function getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

function convertBase64UrlToBlob(urlData: string) {
    var bytes = window.atob(urlData.split(',')[1]);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}

export function createBase64(imageUrl: string, callback: (bash64: string) => void) {
    const image = new Image();
    image.crossOrigin = "";
    image.src = imageUrl;
    image.onload = function () {
        const base64 = getBase64Image(image);
        callback(base64)
    }
}

export function createFile(imageUrl: string, callback: (bash64: Blob | null) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", imageUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            const file = new File([this.response], `${Date.now()}.png`)
            callback(file)
        } else {
            callback(null)
        }
    };
    xhr.send();
    xhr.onerror = () => {
        callback(null);
    }
}
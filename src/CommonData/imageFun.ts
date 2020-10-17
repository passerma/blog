function getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
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
        if (this.status === 200) {
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
const EXIF = require("exif-js");
const ImageHelper = {
    resizeAndRotateImage: function (inImageSource, inMaxLength, inSuccessCallback) {
        var reader = new FileReader();
        reader.readAsDataURL(inImageSource);
        reader.onload = function (e) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            var img = new Image();
            img.onload = function () {
                //設定長邊上限值
                var max_Length = inMaxLength;

                var imgWidth = img.width;
                var imgHeight = img.height;

                if (imgWidth > imgHeight) {
                    if (imgWidth > max_Length) {
                        imgHeight = Math.round(imgHeight *= max_Length / imgWidth);
                        imgWidth = max_Length;
                    }
                } else {
                    if (imgHeight > max_Length) {
                        imgWidth = Math.round(imgWidth *= max_Length / imgHeight);
                        imgHeight = max_Length;
                    }
                }

                canvas.width = imgWidth;
                canvas.height = imgHeight;

                var that = this;
                EXIF.getData(img, function () {
                    var orientation = EXIF.getTag(that, 'Orientation');
                    // alert(orientation);

                    if (orientation == 6 || orientation == 8 || orientation == 3) {
                        var rotateAngle = 0;

                        switch (orientation) {
                            case 3:
                                rotateAngle = 180;
                                break;
                            case 6:
                                rotateAngle = 90;
                                canvas.width = imgHeight;
                                canvas.height = imgWidth;
                                break;
                            case 8:
                                rotateAngle = -90;
                                canvas.width = imgHeight;
                                canvas.height = imgWidth;
                                break;
                        }

                        var x = canvas.width / 2;
                        var y = canvas.height / 2;

                        ctx.translate(x, y);
                        ctx.rotate(rotateAngle * Math.PI / 180);

                        ctx.drawImage(img, (-imgWidth / 2), (-imgHeight / 2), imgWidth, imgHeight);
                    }
                    else {
                        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                    }
                });


                var res = canvas.toDataURL("image/jpeg", 1.0);
                inSuccessCallback(res);
            };

            img.src = e.target.result;
        };
    }
};
export default ImageHelper

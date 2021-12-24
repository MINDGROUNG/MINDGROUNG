const {createCanvas} = require("canvas");
const Canvas = require("canvas");
const Jimp = require('jimp');
const fs = require('fs');

module.exports = (userInfo, successCallBack) =>{

        console.log(`come check in draw`);
        console.log(`draw data check = ${JSON.stringify(userInfo)}`);

        const userAttribute = JSON.parse(userInfo.userAttribute);
        const userNum = userInfo.userUID;

        const width = 600;
        const height = 600;

        const canvas = createCanvas(width, height);

        const context = canvas.getContext("2d");

        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.fillRect(0, 0, width, height);


        let centerX = 300;
        let centerY = 300;

        let radius = 140;

        //크기
        let percentage = [];
        percentage.push(userAttribute['blue'], userAttribute['red'], userAttribute['yellow'], userAttribute['white'], userAttribute['grey'])



        let circleCompo = [
                            [15, 315, 200, [0, 155, 255]],
                            [60, 15, 200, [255, 0, 0]], 
                            [135, 60, 200, [255, 255, 0]], 
                            [225, 135, 200, [242, 242, 242]],
                            [315, 225, 200, [89, 89, 89]]];

        let colorList =[
            [44, 122, 177],
            [0, 155, 255],
            [177, 77, 127],
            [255, 0, 0],
            [255, 127, 0],
            [255, 255, 0],
            [248, 248, 121],
            [242, 242, 242],
            [165, 165, 165],
            [89, 89, 89],
            [44, 122, 177]
        ]


       


        // //실버 원
        let filePath ='./uploads/file/userRing/default.png'
        if(userInfo.thumbNail!=null){
            filePath= './uploads' + userInfo.thumbNail;
        }
        Jimp.read(filePath, async (err, lenna) => {
            if (err) throw err;
            lenna
            .resize(400, 400) // resize
            .quality(60) // set JPEG quality
        //   .greyscale() // set greyscale
            .write(filePath.replace("file/", 'file/thumb_'), () => {
                console.log("write");

                fs.readFile(filePath.replace("file/", 'file/thumb_'), function (err, squid) {
                    if (err) throw err;
                  
                    //이미지 로딩후 그리기
                    let img = new Canvas.Image();
                    img.src = squid;
                    
                    for(let i = 0; i<5; i++){
                        let compo = circleCompo[i];
                        compo[2]= compo[2]*percentage[i]/100;
                        circleCompo[i]=compo;
                    }
            
                    for(let i = 0; i<circleCompo.length; i++){
                        let compo = circleCompo[i];
                        let rgb = compo[3];
                        // let colorList =colorLists[i]
                        let grad = context.createLinearGradient(centerX+Math.cos(Math.PI/180*compo[1])*200,
                                                                centerY+Math.sin(Math.PI/180*compo[1])*200,
                                                                centerX+Math.cos(Math.PI/180*compo[0])*200,
                                                                centerY+Math.sin(Math.PI/180*compo[0])*200);
                        
                        let j = 2*i
                        grad.addColorStop(0, "rgb("+colorList[j][0]+", " +colorList[j][1] +", "+colorList[j][2]+")");
                        grad.addColorStop(0.5, "rgb("+colorList[j+1][0]+", " +colorList[j+1][1] +", "+colorList[j+1][2]+")");
                        grad.addColorStop(1, "rgb("+colorList[j+2][0]+", " +colorList[j+2][1] +", "+colorList[j+2][2]+")");
                        context.beginPath();
                        context.arc(centerX, centerY, 200, Math.PI/180*compo[0], Math.PI/180*compo[1], true)
                        context.strokeStyle = grad;
                        context.lineWidth=5+compo[2];
                        context.stroke();
                    }
    
    
                    //프로필 반원 그리기
                    context.beginPath();
                    context.arc(300, 300, 200, 0, Math.PI * 2, true);
                    context.closePath();
                    context.clip();
    
                    context.drawImage(img, 100, 100, 400, 400);
    
                    context.beginPath();
                    context.arc(300, 300, 200, 0, Math.PI * 2, true);
                    context.clip();
                    context.closePath();
                    context.restore();
    
                    
    
                    const buffer = canvas.toBuffer("image/png");
                    const fs = require("fs");
                    fs.writeFileSync("./client/web/img/userRing/"+userNum+".png", buffer);
                    console.log('before success call back')
                    successCallBack();
                  });
            });
          });
}

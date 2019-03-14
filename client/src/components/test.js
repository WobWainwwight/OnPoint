const re = /.jpg$|.jpeg$|.png$/
//const re = new RegExp(".jpg$|.jpeg$|.png$")
var result = re.exec("gandhi.png")

console.log(result[0])
const axios= require("axios")
const cheerio=require("cheerio")
const fs = require("fs")
const read=require("readline")
const chalk=require("chalk")
const figlet=require("figlet")


async function obtieneHref(hilo,actual){

  let reddit={
    linksVideos:[],
    historias:[],

  }

  await axios.get(`https://www.reddit.com/r/${hilo}/${actual}/`)
  .then((response) => {
        let $ = cheerio.load(response.data);
        $('a').each((i, e)=> {
        let h=$(e).attr('href').split("/")


          for(let y =0;y<h.length;y++){
          // solo acepta las putas url que llevan a las historias
            if(h[y]=="comments" && h[y-2]=="r"&& h.length==9 ){

             	//esto es para darle un jodido nombre
      	     	let nuevoValor = $(e).attr('href');

      	     	reddit.linksVideos.push(nuevoValor)

          }
        }
      });

      }).catch(function (e) {

        if(e){
          console.log(chalk.inverse.red("algo a salido mal intentelo de nuevo "))
        }
      })
      let a=JSON.stringify(reddit)
      fs.writeFile("videos.json",a,(err)=>{
        if (err) {
          console.log(err)
        }
      });
}
const rl = read.createInterface({
  input: process.stdin,
  output: process.stdout
});
function pregunta(){
  rl.question(chalk.red('[?]que subreddit quieres obtener? '), (subreddit) => {
    if(subreddit!=""){
    rl.question(chalk.red('[?]quieres que sea? (hot)(top)(new) '), (actual) => {
          if(actual!=""){
          console.log(chalk.magenta(`[+]se esta obtieniendo los links del hilo: ${subreddit}`));
          obtieneHref(subreddit,actual)
          rl.close();}
          else{
            console.log(chalk.inverse.red("ingrese (hot) o (top) o (new) hijo de puta "))
            pregunta()
          }
        });}else{
          console.log(chalk.inverse.red("ingrese un subreddit hijo de puta"))
          pregunta()
        }
    });
}


console.log(chalk.greenBright(figlet.textSync('reddit replace humans', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
})));

pregunta();

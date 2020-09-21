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
          console.log(e)
        }
      })
      let a=JSON.stringify(reddit)
      fs.writeFile("videos.json",a,(err)=>{
        if (err) {
          console.log(err)
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
const rl = read.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(chalk.red('[?]que hilo quieres obtener? '), (hilo) => {

  // TODO: Log the answer in a database
  rl.question(chalk.red('[?]quieres que sea? (hot)(top)(new) '), (actual) => {
    // TODO: Log the answer in a database

    console.log(chalk.magenta(`[+]se esta obtieniendo los links del hilo: ${hilo}`));
     obtieneHref(hilo,actual)
     rl.close();

  })

});

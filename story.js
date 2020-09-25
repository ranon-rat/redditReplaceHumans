
const axios= require("axios")
const cheerio=require("cheerio")
const fs=require("fs")
let json=require("./videos.json")
const chalk=require("chalk")
const read=require("readline")

///es para que cuando carguemos la historia sea mas facil convertirlo

function generateRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
return Math.floor(Math.random() * (1 + max - min) + min);
}

function noR(lista){//es una funcion recursiva
/*lo que hace esta funcion es limpiar el arrray de elementos repetidos
asi en los videos no se repetira una misma historia

al ser una funcion recursiva me refiero a que esta funcion se repite dentro de si
por lo cual no se repetira mas de una ves una misma variable y estaremos limpios uwu
*/
	for(let y=0;y<lista.length;y++){
		for(let x=0;x<lista.length;x++){
			if(lista[x]===lista[y]&& x!=y ){
				lista.splice(y,1);
				lista.push(generateRandom(0,json.linksVideos.length-1));
				noR(lista);
				let m=lista;

			}
		}
	}
	let m=lista
	return m
}

async function cargahistoria(repeticion){
	let his=[];
	let m;
	if(repeticion<=json.linksVideos.length){
		for(let i =0;i<repeticion;i++){
			his.push(generateRandom(0,json.linksVideos.length-1));
			m=noR(his);
		}
		let texto={//es para tener un control de datos
				titulo:"",
				historia:"",
		};
		for(let i =0;i<repeticion;i++){
			await axios.get(json.linksVideos[m[i]])//webscrapping a un link random
			.then((response) => {
				//
				let $ = cheerio.load(response.data);
				let titulo = $("h1").text();
				let historia = [];
				//definimos las variables
				try{// es por si no puede obtener la variable dentro de una clase
					historia.push($(".D3IL3FD0RFy_mkKLPwL4").text());
					console.log(chalk.greenBright(`[+] nueva historia ${chalk.cyan(titulo)}`));
				}
				catch(e){
						console.log(e);
					if(e){
						try{
							historia.push($("._3xX726aBn29LDbsDtzr_6E").text());
							console.log(chalk.inverse.yellow(`[+] nueva historia ${titulo}`));
						}
						catch(err){
							if(err){
								historia.push($("._1Ap4F5maDtT1E1YuCiaO0r").text());
								console.log(chalk.inverse.red(`[+] nueva historia ${titulo}`));
							}
						}
					}
				}
				/*
				estas son las clases donde puede que se guarde el texto

				_3xX726aBn29LDbsDtzr_6E
				_1Ap4F5maDtT1E1YuCiaO0r
				D3IL3FD0RFy_mkKLPwL4,

				*/
				let historiaFiltrada=historia.map((historia1)=>{
					return historia1.replace(/'"'/gi,"'").replace(/'{'/gi,"(").replace(/"}"/gi,")");
					//es para que filtre la historia
				})
				texto.titulo=titulo;// es para crear un nuevo atributo llamado titulo
				texto.historia=historiaFiltrada;// es para agregar la historia
				json.historias.push(texto);// es para que se agregue a un array que esta dentro del json
				let a=JSON.stringify(json);
				fs.writeFile("videos.json",a,function(err){});
			}).catch((err)=>{
				console.log("algo no esta bien, trate de nuevo con un link diferente o con una cantidad de historias diferentes");
			})
		}
	}
	else{
		console.log(chalk.inverse.red(`coño de la madre ingrese un valor que no supere a ${json.linksVideos.length}`));
		pregunta();
	}
}
const rl = read.createInterface({
	input: process.stdin,
	output: process.stdout
  });
function pregunta(){//es para evitar que se equivoquen hijos de puta
	rl.question(chalk.yellow(`[?] ¿Cuantas historias quiere? (limite ${json.linksVideos.length}) `), (answer) => {
		if(answer!=""){
			console.log(chalk.redBright(`[+] agregando historias`));
				try{
					cargahistoria(parseInt(answer,10));
					rl.close();
				}catch(e){
					if(e){
					 console.log(chalk.inverse.red("el coño de tu madre ingresa un valor valido"));
					 pregunta();
				 }
			 }
		}
		else{
			console.log(chalk.inverse.red("no se obtendra ningun link, intentelo de nuevo"));
			pregunta();
		}
	})
}
pregunta();

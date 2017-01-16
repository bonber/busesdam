/**
 * Ejemplo de servicio basado en Node.js para crear contenido dinámico para un bot.
 *
 */

// Puerto en el que escucha el servidor Node.js (lo obtiene de una variable de entorno y si no existe, el 3000)
const PORT = process.env.PORT || 3000;

// Importamos el framework Express y lo inicializamos
var express = require("express");
var app = express();

// El contenido de la carpeta public se muestra en la raíz del servidor
app.use(express.static(__dirname + "/public"));

var bilbaoM = ["06:35", "07:00", "07:15", "07:30", "08:00", "08:30", "08:45", "09:00", "09:15", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:15", "13:45", "14:00", "14:30"];
var bilbaoT = ["14:50", "15:10", "15:30", "15:45", "16:00", "16:30", "17:00", "17:30", "18:00", "18:15", "18:40", "19:00", "19:20", "19:45", "20:15", "20:30", "20:45", "21:30", "22:15"];
var donostiM = ["00:30", "07:30", "08:30", "08:45", "09:00", "10:00", "12:00", "13:00"];
var donostiT = ["14:00", "15:15", "16:00", "18:30", "20:30"];
var pamplonaM = ["07:00", "09:00", "10:00", "11:30", "13:00"];
var pamplonaT = ["15:00", "15:30", "17:00", "18:00", "19:00", "20:30", "21:00"];

var ahora = new Date();  
var horas=ahora.getHours()+1; //Le añadimos 1 para que sea el horario de aquí
var minutos=ahora.getMinutes();
var hora=horas+":"+minutos;
function mostrarH(horarios) {
	respu = "Tienes "+horarios.length+" buses a la mañana";
	for (i in horarios) {
		respu+="\n"+horarios[i]; 
	}
	var salir = false;
	var cuenta=0;
	var r = "";
	while (salir==false) {
		var ho=horarios[cuenta].split(":");
		if (ho[0]>=horas){
			if (ho[0]==horas){
				if (minutos<ho[1]){
					var tiempo_esp = parseInt(ho[1])+minutos;
					r = "\nSon las "+hora+", te faltan "+tiempo_esp+" minutos para el siguiente bus 1";
					salir=true;
				}
			}else{
				var tiempo_esp = 60-minutos+parseInt(ho[1])+(60*(ho[0]-horas-1));
				r = "\nSon las "+hora+", te faltan "+tiempo_esp+" minutos para el siguiente bus 2";
				salir=true;
			}	
		}else{
			r="\nNo tienes buses hoy";
		}
		if (cuenta >= horarios.length-1){
			salir=true;
		}
		cuenta++;
	}
	respu+=r;
	return respu;
}

app.get("/buses/:lugar/:parte", function (req, res) {

    // Obtener la fecha que llega en la URL
    var lugar = req.params.lugar;
    var parte = req.params.parte;
	var resp = "";
	switch (lugar) {
		case "bilbao":
			if (parte == "manana"){
				resp = mostrarH(bilbaoM);
			}else if (parte == "tarde"){
				resp = mostrarH(bilbaoT);
			}
			break;
		case "donosti":
			if (parte == "manana"){
				resp = mostrarH(donostiM);
			}else if (parte == "tarde"){
				resp = mostrarH(donostiT);
			}
			break;
		case "pamplona":
			if (parte == "manana"){
				resp = mostrarH(pamplonaM);
			}else if (parte == "tarde"){
				resp = mostrarH(pamplonaT);
			}
			break;
	}
    // Crear el objeto con la respuesta
    var respuesta = [
        {
            text: resp,
        }
    ];

    // Devolver el objeto en formato JSON
    res.json(respuesta);
});

// Arrancar el servidor y dejarlo a la espera
app.listen(PORT, function () {
    console.log("Servidor Express escuchando en el puerto " + PORT + "...");
});

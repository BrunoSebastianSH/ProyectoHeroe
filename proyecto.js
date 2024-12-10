'use strict'
//cuando la ventana de la pagina se carge se llamara a la funcion inicio
window.onload = inicio;

function inicio() {
    //declaracion de etiquetas html a usar en el JS
    let inputNombre = document.getElementById("nombre");
    let mensajeInput = document.getElementById("mensajeInput");
    let botonNombre = document.getElementById("botonEnviar");
    let h1mensaje = document.getElementById("mensajeLuchar");
    let tabla = document.getElementById("tabla");
    //tiradas a realizar
    let numeroTiradas = 0;
    //expresion regular para comrpobar si hay numeros 
    let regexNumeros = /\d/;
    //al boton del nombre le pasamos la funcion validarnombre
    botonNombre.addEventListener("click", validarNombre)

    function validarNombre() {
        //comrpobamos si tiene numeros y modificaremos el mensaje para que muestre el texto
        if (regexNumeros.test(inputNombre.value)) {
            mensajeInput.textContent = "numeros no permitdos";
        }
        //si no tiene numeros, comprobamos si el tamaño es menor que 4 letras y cambiamos el texto
        else if (inputNombre.value.length < 4) {
            mensajeInput.textContent = "el nombre debe tener 4 o mas letras"
        }
        //si no cumple ninguna de las anteriores se procedera a crear el boton jugar
        else {
            mensajeInput.textContent = "";
            //creamos el texto junto al nombre introducido
            h1mensaje.textContent = "A luchar heroe: " + inputNombre.value;
            let salto = document.createElement("br");
            //creacion del boton jugar, al que añadimos un id para luego referenciarlo
            let botonJugar = document.createElement("button");
            botonJugar.setAttribute("id", "botonJugar");
            botonJugar.textContent = "Jugar";
            //lo añadimos debajo del h1, tanto el salto como el boton
            document.getElementsByTagName("h1")[0].appendChild(salto);
            document.getElementsByTagName("h1")[0].appendChild(botonJugar);
            //a este boton le añadimos un evento con su funcion
            botonJugar.addEventListener("click", generarTablero);
        }
    }
    //generamos el tablero
    function generarTablero() {
        //se generara 10 columnas y 10 filas con un bucle for
        for (let i = 0; i < 10; i++) {
            let columna = document.createElement("tr");

            for (let j = 0; j < 10; j++) {
                //cada celda que se cree tendra un color azul, con tamaño de 50px
                let fila = document.createElement("td");
                fila.style.backgroundColor = "blue";
                fila.style.width = "50px";
                fila.style.height = "50px";
                //creamos la etiqueta img para introducir imagenes
                let imagen = document.createElement("img");
                imagen.style.width = "50px";
                imagen.style.height = "50px";
                //añadimos las filas a la columna y guardamos en variables la posicion de cada una
                columna.appendChild(fila);
                let posicionX = i;
                let posicionY = j
                //tambien guardamos en un atributo la posicion de cada celda para usarlo mas adelante
                fila.setAttribute("posX", i);
                fila.setAttribute("posY", j);
                if (posicionX == 0 && posicionY == 0) {
                    //insertamos la imagen del heroe en la primera posicion
                    imagen.setAttribute("src", "./heroe.jpg");
                    imagen.setAttribute("id", "imagenHeroe")
                    fila.appendChild(imagen);
                }
                //guardamos la imagen del cofre en la ultima posicion
                if (posicionX == 9 && posicionY == 9) {
                    imagen.setAttribute("src", "./cofre.jpg");
                    fila.appendChild(imagen);
                }

            }
            //dentro de la tabla guardamos las columnas
            tabla.appendChild(columna);
        }
        //al terminar el tablero quitamos el boton jugar
        document.getElementById("botonJugar").style.display = "none";
        //creamos el boton para tirar el dado, le damos un id y un texto
        let tirarDado = document.createElement("button");
        tirarDado.setAttribute("id", "botonDado");
        tirarDado.textContent = "tirar dado";
        document.body.appendChild(tirarDado);
        //para la imagen del dado creamos un elemento con un id, el estilo y lo agregamos al documento
        let dado = document.createElement("img");
        dado.setAttribute("id", "imagenDado");
        dado.style.width = "100px";
        dado.setAttribute("src", "./dado.jpg");
        document.body.appendChild(dado);
        //le añadimos una funcion para tirar el dado
        tirarDado.addEventListener("click", tirarElDado);
    }

    //declaramos la posicion del heroe globalmente, ya que se declararia mas veces en la funcion
    let posicionHeroe = [0, 0];
    function tirarElDado(e) {
        //creamos el numero aleatoriamente que guardaremos en un h1, que aparecera junto al boton
        let numero = Math.floor(Math.random() * 6 + 1);
        let h1numero = document.createElement("h1");
        h1numero.textContent = numero;
        //llamamos al boton dado mediante id, y cambiamos el texto a tirar dado y el h1 del numero cada vez que se llame a la funcion
        let botonDado = document.getElementById("botonDado");
        botonDado.textContent = "tirar dado";
        botonDado.appendChild(h1numero);
        //declaramos en una variable todas las celdas de la tabla
        let celdas = document.getElementsByTagName("td");
        //y recorremos el array de td para asignar las celdas posibles a recorrer
        for (let i = 0; i < celdas.length; i++) {
            //cada celda se guarda en una variable y se cambia el fondo al azul cada vez que se mueva el heroe(vuelva a llamar a la funcion)
            let celda = celdas[i];
            celda.style.backgroundColor = "blue";
            //guardamos cada posicion de las celdas, pasandolo a numerico entero
            let fila = parseInt(celda.getAttribute("posX"));
            let col = parseInt(celda.getAttribute("posY"));
            /*verificamos dos condiciones, si la fila es igual a la posicion del heroe y la columna restado a la posicion del heroe
            es menor al numero (movimiento horizontal), o si se cumple que la columna es donde esta el heroe y la fila del heore es menor al numero
            (vertical) se cambiara el color a rojo y se añadira la funcion para mover el heroe a esa celda
            */
            if ((fila == posicionHeroe[0] && (col - posicionHeroe[1]) <= numero) ||
                (col == posicionHeroe[1] && (fila - posicionHeroe[0]) <= numero)) {
                celda.style.backgroundColor = "red";
                celda.addEventListener("click", moverHeroe);
            }

        }


        function moverHeroe(e) {
            //cada vez que se ejecute la funcion las tiradas aumentaran
            numeroTiradas++;
            //de la celda a la que hacemos click con el evento se guardara su posicion
            let celda = e.target;
            let fila = parseInt(celda.getAttribute("posX"));
            let col = parseInt(celda.getAttribute("posY"));

            //la celda donde estara el heroe, a la que llamamos segun su atributo y posicion mediante la tabla, la cambiaremos a blanco
            let celdaHeroe = tabla.querySelector(`td[posX="${posicionHeroe[0]}"][posY="${posicionHeroe[1]}"]`);
            celdaHeroe.style.backgroundColor = "white";
            //guardamos la nueva posicion del heroe en el array
            posicionHeroe = [fila, col];
            //a la celda que hacemos click, le añadiremos la imgen del heroe
            let imagenHeroe = document.getElementById("imagenHeroe");
            celda.appendChild(imagenHeroe);
            /*para verificar cuando el heroe llega al cofre, veremos si la posicion es NaN, ya que al ser
            ser una imagen, al hacer click sobre el tesoro, guardaremos la imagen y no la celda con sus posiciones,
            por lo que es la unica celda con posiciones NaN*/
            if (isNaN(posicionHeroe[0, 0])) {
                //guardamos en el localStorage el item de las veces que hemos tirado como record y mostramos el mensaje
                localStorage.setItem("record", numeroTiradas);
                alert("¡Victoria!, el numero de tiradas es: " + numeroTiradas);
                //obtenemos el record del localstorage y comprobamos
                let record = localStorage.getItem("record");
                //si es record guardado es menor a las tiradas entonces no hay nuevo record
                if (record < numeroTiradas) {
                    alert("no se ha superado el record de: " + record);
                }
                else {
                    //si es mayor o igual se mostrara el mesnaje y se guardara las tiradas en el record
                    alert("se ha superado el record de: " + record);
                    localStorage.setItem("record", numeroTiradas);
                }

            }

        }

    }


}
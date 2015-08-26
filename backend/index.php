<html>
  <head>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
  </head>
    <body>
        <?php

        /*$mysqli = new mysqli("127.0.0.1", "poi", "poi", "basedatospoi", 3306);
        if ($mysqli->connect_errno) {
            echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        }
        $mysqli->set_charset("utf8");
        echo $mysqli->host_info . "\n<hr />";

        //////////////////////////////////////

        $valores = $mysqli->query('SELECT * FROM puntosdeinteres ORDER BY tipo');
        while($row = $valores->fetch_array(MYSQLI_ASSOC)) {
                $myArray[] = $row;
                print_r ($row);
                print(json_encode($row));
                echo '<hr />';
        }
        echo '<hr /><hr />';
        print_r (json_encode($myArray));*/
        ?>
        <hr /><h1>JS</h1><hr />
        <div id="botones" style="float:left"></div>
        <div id="controles">
          <label><input type="checkbox" onchange="javascript:toggleColor('red')" checked="true"/>Rojo</label>
          <label><input type="checkbox" onchange="javascript:toggleColor('blue')" checked="true"/>Azul</label>
          <label><input type="checkbox" onchange="javascript:toggleColor('green')" checked="true"/>Verde</label>
          <br />
          <label><input type="checkbox" onchange="javascript:toggleText('Hello')" checked="true"/>Hello</label>
          <label><input type="checkbox" onchange="javascript:toggleText('Adios')" checked="true"/>Adios</label>
        </div>
          <script>
            function ListaArrays(){

            }
            ListaArrays.prototype.insertar2 = function(objeto,prop1,prop2) {
                if( this[objeto[prop1][prop2]] == undefined ){
                  this[objeto[prop1][prop2]] = new Array(objeto);
                  this[objeto[prop1][prop2]+"_bool"] = true;
                }
                else{
                  this[objeto[prop1][prop2]].push(objeto);
                }
            };
            ListaArrays.prototype.insertar = function(objeto,prop1) {
                if( this[objeto[prop1]] == undefined ){
                  this[objeto[prop1]] = new Array(objeto);
                }
                else{
                  this[objeto[prop1]].push(objeto);
                }
            };



            var colores = new ListaArrays();
            var textos = new ListaArrays();

            var toggleColor = function(color){
              for(var i=0; i<colores[color].length; ++i){
                if( ! colores[color+"_bool"] )
                  colores[color][i].style.display = "block";
                else
                  colores[color][i].style.display = "none";

              }
              colores[color+"_bool"] = !colores[color+"_bool"];
            }

            var toggleText = function(text){
              alert(text);
              for(var i=0; i<textos[text].length; ++i){
                if( ! textos[text+"_bool"] )
                  textos[text][i].style.display = "block";
                else
                  textos[text][i].style.display = "none";

              }
              textos[text+"_bool"] = !textos[text+"_bool"];
            }

            console.log(colores);
            var botones = document.getElementById('botones');

            var div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.background = "red";
            div.style.color = "white";
            div.innerHTML = "Hello";
            colores.insertar2(div,"style","backgroundColor");
            textos.insertar(div,"innerHTML");
            botones.appendChild(div);

            div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.background = "blue";
            div.style.color = "white";
            div.innerHTML = "Adios";
            colores.insertar2(div,"style","backgroundColor");
            textos.insertar(div,"innerHTML");
            botones.appendChild(div);

            div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.background = "green";
            div.style.color = "white";
            div.innerHTML = "Hello";
            colores.insertar2(div,"style","backgroundColor");
            textos.insertar(div,"innerHTML");
            botones.appendChild(div);

            div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.background = "red";
            div.style.color = "white";
            div.innerHTML = "Adios";
            botones.appendChild(div);
            colores.insertar2(div,"style","backgroundColor");
            textos.insertar(div,"innerHTML");
            console.log(colores);
            console.log(textos);
            toggleColor('red');
            toggleColor('red');
          </script>
    </body>
</html>

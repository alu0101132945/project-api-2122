# 012 -  API Node/Express de gestión de información musical
```
>>  PROYECTO: API Node/Express de gestión de información musical
>>  EQUIPO: Grupo_O
>>  CURSO: 2021 - 2022
>>  COMPONENTES: XueMei Lin
>>               Noelia Ibáñez Silvestre
>>               Andrea Hernandez Martín
>>               Stephanie Andreína Arismendi Escobar
                 Carlos Pío Reyes
>>  EMAIL:       alu0101225845@ull.edu.es
>>               alu0101225555@ull.edu.es
>>               alu0101119137@ull.edu.es
>>               alu0101351728@ull.edu.es
                 alu0101132945@ull.edu.es
>>  UNIVERSIDAD: Universidad de La Laguna
>>  ASIGNATURA:  Desarrollo de Sistemas informáticos
>>  VERSION:     4.0.0
>> Herramienta: Visual Studio Code
>> Lenguaje de programción: TypeScript
```

## 1. Introducción
Esta practica consiste en llevar a cabo una implementacion de **API REST** usando los paquetes de Node y Express, por lo cual nos permite hacer operaciones de creacion, lectura, modificacion y eliminacion (Create, Read, Update, Delete - CRUD) de canciones, artistas y playlists.


## 2. Objetivos
El objetivo de esta práctica es aprender el uso de **MongoDB** (un sistema de base de datos no relacional), **Mongoose**, para gestionar la base de datos desde `Node.js` 

El objetivo de esta práctica es aprender a diseñar e implementar un modelo de datos siguiendo el diseño orientado a objetos. También, se debe aprender a utilizar las herramientas descritas en clase, las cuales son la documentación mediante TypeDoc, las pruebas unitarias del código fuente con Mocha y Chai, siguiendo la métodología TDD o BDD, el uso de Instanbull y Coveralls para el cubrimiento de código, con la integración continua con Github Actions y la comprobación de la calidad del código mediante Sonar Cloud. Además, se debe aprender el uso de Inquier y Lowdb para gestionar una base de datos por la consola.


## 3. Estructura.

La api manejará canciones, artistas y playlists. Estas serán accesibles desde sus respectivas rutas, y cada una de ellas deberá poderse crear, leer, actualizar o borrar mediante los métodos http necesarios.

Las diferentes entidades tendrán las siguientes características (atributos):

- Canción: representa a cada canción dentro de un álbum.
    1. Nombre de la cancón. 
    2. Autor de la canción.
    3. Duración en minutos y segundos.
    4. Género(s) al que pertenece.
    5. Single: Flag que determina si la canción fue lanzada como single o no.
    6. Número de reproducciones totales.
     
- Artistas: representa a cada artista presente en la api.
    1. Nombre del artista.
    2. Género(s) musicales relacionados.
    3. Canciones publicadas.
    4. Cantidad de oyentes mensuales. Es la suma de los oyentes mensuales de todas sus canciones.

- Playlists: funcionará como una lista de reproducción de música de alguna plataforma digital como Spotify. 
    1. Nombre de la playlist.
    2. Canciones incluidas dentro de la playlist.
    3. Duración en horas y minutos.
    4. Género(s) musicales que se incluyen dentro de la playlist.


## 4. Implementación.

### Conexión al servidor de MongoDB

Se hará uso deol método `connect` de Moongoose, que recibe como primer argumento la URL de conexión al servidor. En este caso contendrá la dirección al servidor de `heroku`, cuyo despliegue se explicará más adelante.

El segundo argumento es un objeto con las opcione de conexión.

```typescript

const databaseURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/music-app';

connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unnable to connect to MongoDB server');
});

```

### Modelado de objetos.

Para cada entidad se creará un diferente fichero de modelado. Dentro de cada uno se seguirá el mismo procedimiento, así que a continuación se explicará únicamente el desarrollo de la entidad `Artista` como muestra representativa.

Primeramente se creará una interfaz denominada `ArtistDocumentInterface`, que heredará de `Document`. Esta interfaz permitirá definir la forma de un artista, añadiendo los atributos descritos en el apartado anterior. En este caso, serían `name` (un string), `genre` (un array de strings, pues puede pertenecer a varios géneros), `songs` (un array de strings, ya que puede tener varias canciones) y `oyentes` (number, pues es una cantidad numérica). Cabe destacar que `oyentes` es opcional. 

```typescript

interface ArtistDocumentInterface extends Document {
  name: string,
  genre: string[],
  songs: string[],
  oyentes?: number
}

```

Seguidamente se declarará `ArtistSchema` utilizando el constructor de `Schema` con `ArtistDocumentInterface` como argumento de tipo. Esta indicando que nuestras notas deberán de tener cuatro propiedades: `name`, del tipo `String`, `genre` y `songs` del tipo `[String]`, además de `oyentes` del tipo `Number`. En este esquema también se usarán los validadores, que se explicarán seguidamente en una división por propiedades:

- `name`:
    1. Debe ser único.
    2. Es obligatoria su especificación.
    3. La opción trim indica que, en el caso de que hayan espacios en blanco en el string, los elimina.
    4. El nombre debe de empezar con mayúscula, en otro caso saltará un error.
- `genre`:
    1. Es obligatoria su especificación.
    2. La opción trim indica que, en el caso de que hayan espacios en blanco en el string, los elimina.
- `songs`:
    1. Es obligatoria su especificación.
    2. La opción trim indica que, en el caso de que hayan espacios en blanco en el string, los elimina.
- `oyentes`:
    1. La opción trim indica que, en el caso de que hayan espacios en blanco en el string, los elimina.
    2. El valor por defecto, en caso de no especificarse un número, será cero.

Finalmente, se invocará la función `model` usando también como argumento de tipo `ArtistDocumentInterface`. Esto se hace con dos argumentos: `Artist`, quue será la cadena de carácteres que da nombre al modelo, y `ArtistSchema`, el esquema creado anteriormente. 

`Model` devolverá un objeto `Model<ArtistDocumentInterface>` que quedará apuntado por `Artist`, a partir del que se podrá instanciar documentos `ArtistDocumentInterface`. Estos tendrán que ajustarse a lo especificado en el esquema definido antes de ser insertados en una colección de la base de datos.

### Creación de rutas

Se separarán las rutas de acceso en distintos ficheros para facilitar la lectura del código. Esta división se hará por métodos HTTP; es decir, POST, GET, PACH, y DELETE.

- Default: este fichero contendrá la ruta de accesso por defecto, donde se llegará cuando se realice una petición vacía. Esto enviará el estado 501 (Not Implemented). 

- Delete: este fichero implementa el borrado para cada entidad de dos maneras diferentes, la primera buscando a través del nombre para después borrar y la segunda, borrará mediante su identificador único.

En el primer caso, se comprueba primero si la petición incluye una *query string* con una clave `name`, es decir, se especifica con la petición el nombre de la canción/artista/playlist que se desea borrar. En caso de que no se incluya, se envía un estado 400 de vuelta al cliente.

En caso contrario, se usa el método `findOneAndDelete` que recibe como argumento un objeto que especifica los parámetros de la búsqueda, en nuestro caso, el nombre. Si el nombre que se ha especificado no existe, enviamos un estado 404 de vuelta al cliente. En caso de que si se haya encontrado y borrado, la enviamos de vuelta como respuesta al cliente.

Si ocurre otro tipo de error durante la operación se envía un estado 400 como se observa la parte del manejador `catch`.

La lógica del segundo caso es muy similar aunque con las siguientes diferencias: en primer lugar, se modifica la ruta añadiendo `/:id` introduciendo dinamismo. En segundo lugar, no hace falta comprobar si se le pasa una *query string* ya que no se busca por nombre y, en tercer lugar, se usa el método `findByIdAndDelete`.

- Get: en este fichero creamos los puntos de acceso para poder acceder a los objetos que hemos insertado en la base de datos. El primer punto de acceso permitirá acceder a todos los objetos almacenados de una entidad, o bien, obtener un único objeto por su nombre. El segundo punto de acceso permitirá obtener el objeto por su identificador único.

En el primer punto, lo primero que hacemos es comprobar si la petición GET realizada a partir de la ruta de la entidad correspondiente (`/artist`, `/song`, `/playlist`) contiene una *query string* donde exista una clave denominada `name` ó `title` dependiendo del caso. Si es así, nuestro filtro de búsqueda consistirá en un objeto cuya propiedad `name` ó `title` tomará el valor asignado a la clave con mismo nombre de la *query string*. En caso de no indicar ninguna *query string*, el filtro será un objeto vacío. 
A continuación, si es correcto, invocamos al método `find` del modelo para buscar aquellos documentos que coincidan con el filtro especificado. Como se pueden devolver varios, uno ó ningún objeto, se comprueba si retorna algún objeto una vez se ha llevado a cabo la búsqueda. Si es así, se envían los objetos encontrados de vuelta al cliente y, en caso contrario, enviamos como resuesta el estado 404 *(Not Found)*. Si se produjo algún error durante la búsqueda, se envía como respuesta un estado 500 *(Internal Server Error)*. 

El segundo punto de acceso es bastante similar, aunque con algunas diferencias. Estas son: añadir la cadena `/:id` en la ruta de búsqueda para especificar el identificador único de un objeto de la entidad correspondiente para, luego en el manejador, poder acceder a dicho id haciendo uso de `req.params.id`. Y, por otro lado, usar el método `findById` que perimte buscar documentos por su identificador único y, además, sin la necesidad de tener que instanciar un objeto `ObjectID` de manera explícita.

- Patch: este fichero contendrá los puntos de acceso para poder actualizar los artistas, las playlists y las canciones que tenemos almacenadas en la base de datos. Al igual que los casos ficheros anteriores, el primer punto de acceso permitirá buscar y actulizar por el nombre y, en cambio, el segundo punto de acceso lo hará mediante su identificador único.

En el primer caso, empezamos comprobando si la petición incluye una *query string* con el nombre del objeto que deseamos actualizar. En caso de que no se incluya, enviamos un estado 400 al cliente.

En caso contrario, definimmos un array `allowedUpdates` que incluye una lista con los campos que vamos a permitir actualizar. El array `actualUpdates` contendrá los nombres de las propiedades del objeto apuntado por el cuerpo de la petición `req.body`, es decir, los nombres de los campos que se quieren actualizar, los cuales vienen especificados en el cuerpo de la petición. El método `every` permite llevar a cabo algún tipo de comprobación o prueba lógica sobre todos los elementos de un array. En este caso, comprobamos si todos los campos que se desean actualizar se encuentran incluidos en la lista de campos que permitimos actualizar. Si no es así, es decir, `isValidUpdate` es falso, enviamos un estado 400 como respuesta de vuelta al cliente.

En caso de que la operación de actualización sea válida, utilizamos el método `findOneAndUpdate` que recibe como primer argumento el nombre del objeto que estamos buscando. En segundo lugar, recibe otro objeto que permite especificar las modificaciones a realizar, en este caso, el cuerpo de la petición que se ha realizado. Por último, recibe un objeto con las opciones `new` para poder acceder al documento ya modificado y `runValidators`, que lleva a cabo todas las validaciones especificadas a través del esquema de Mongoose sobre los nuevos valores que toman las propiedades que quieren actualizarse.
Si el objeto buscado no ha hs sido encontrado, se envía un estado 404 al cliente y, en caso de haberlo encontrado y actualizado, se envía dicho objeto de vuelta como respuesta al cliente. En caso de otro tipo de error durante la operación de actualización, se envía el error producido junto al estado 400.

Para que no se muestren mensajes relacionados con el uso de `findOneAndUpdate`, deshabilitamos marcando como `false` la opción `useFindAndModify` en el fichero `src/db/mongoose.ts`.

La lógica de la opción de buscar y actualizar según el identificador único, es muy similar aunque con las siguientes diferencias: primero, no hace falta comprobar si se le pasa una *query string* y segundo, hacemos uso del método `findByIdAndUpdate`.

- Post: contiene el desarrollo para poder insertar un documento, en nuestro caso una canción, artista ó plylist en la base de datos. Recibe como primer parámetro una ruta, y en segundo lugar, un *callback*.

Cuando realicemos la petición, debemos pasar la ruta junto al cuerpo, al que se accederá a través de `req.body`. Si el objeto no contiene alguna de las propiedades obligatorias o si contiene valores no válidos, entre otros tipo de posibles situaciones, se enviará un mensaje de error junto al estado 400. En caso de que la petición se realizara correctamente, se insertaría el objeto y se devolvería el estado 201. 

### Index.ts

En el fichero `index.ts` se puede observar como, en primer lugar, importamos todos y cada uno de los routers que hemos definido anteriormente. Además, vemos como registramos cada uno de esos routers en nuestra aplicación a partir del uso del método `app.use()` y definimos la constante `port`.

## 5. Despliegue de la API REST
Para el despliegue de la API se usaron MongoDB Atlas junto a Heroku siguiendo las instrucciones proporcionadas en los [apuntes](https://ull-esit-inf-dsi-2122.github.io/nodejs-theory/nodejs-deployment.html).

## 6. Thunder Client
Para llevar a cabo las pruebas de las peticiones hicimos uso de la herramienta Thunder Client, obteniendo como resultado el [siguiente json](/home/usuario/ull-esit-inf-dsi-21-22-prct12-music-api-grupo-o/thunder-collection_music-api.json) con todas las pruebas realizadas.

## 7. Documentación TypeDoc  
Para la documentación de los ejercicios se utilizó la herramienta TypeDoc que convierte los comentarios en el código fuente de TypeScript en documentación HTML renderizada. A continuación, se adjunta el enlace a la página web creada mediante TypeDoc.  
[Enlace repositorio documentacion Typedoc](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct12-music-api-grupo-o/tree/main/docs)  


## 8. Conclusiones
Con la realización de esta práctica se ha podido aprender a utilizar herramientas como `MongoDB` y `Mongoose`, bastantes útiles y sencillas de utilizar en comparación con otras bases de datos; también se ha tenido que practicar la creación de peticiones HTTP mediante la herramienta `Thunder client`, algo de vital importancia para saber si la API realizada está funcionando correctamente o no. Además, hemos podido aprender un poco sobre el despliegue de las API REST mediente la plataforma `Heroku`, la cual que permite crear, ejecutar y operar aplicaciones completamente en la nube.  

Además, al ser un trabajo de grandes dimensiones y mucho trabajo en grupo, se ha podido experimentar muy por encima lo que podría llegar a ser un proyecto de la vida real, con una división de trabajos, un tiempo límite y un producto de utilidad en el día a día (como vendría a ser una API de una colección musical).  

En cuanto a las dificultades que hemos tenido realizando la práctica, lo que cabe destacar ha sido el despliegue de la API mediante `heroku` ya que es una plataforma que no habíamos utilizado con anterioridad y al principio nos pareció complicada de entender debido a las URL que hay que especificar y las autenticaciones a utilizar para poder hacer uso de esta a través de `Thunder Client`, pero al final con el desarollo de la práctica pudimos comprender su uso.  

Por otra parte, en cuanto al trabajo realizado, fue un trabajo en grupo en el que la mayor parte de las veces nos conectamos todos los miembros del grupo mediante Google Meet y resolvimos los problemas de realización del proyecto mediante la extensión de Live Share de VSCode, de manera que hicimos el trabajo totalmente colaborativo. Solo hubieron ciertas tareas que nos repartimos para hacer cada una por separado.  

## 9. Bibliografía
- [Clases abstractas e interfaces](https://ifgeekthen.everis.com/es/clases-abstractas-e-interfaces)
- [Relaciones de clases abstractas](https://qastack.mx/programming/597769/how-do-i-create-an-abstract-base-class-in-javascript)
- [Clases y métodos](https://lenguajejs.com/javascript/caracteristicas/clases-es6/)
- [Apuntes de la clases](https://ull-esit-inf-dsi-2122.github.io/nodejs-theory/)
- [Guión de la práctica](https://ull-esit-inf-dsi-2122.github.io/prct12-music-api/)
- [MongoDB](https://www.mongodb.com/es)
- [Mongoose](https://mongoosejs.com/)
- [Heroku](https://www.heroku.com/)

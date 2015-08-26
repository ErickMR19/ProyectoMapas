DROP TABLE IF EXISTS puntosDeInteres;

CREATE TABLE puntosDeInteres(
	id INT(11) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	tipo CHAR(1) NOT NULL,
	distrito INT(1) NOT NULL,
	geometria POINT NULL,
	direccion VARCHAR(50),
	telefonos VARCHAR(50),
	correo_electronico VARCHAR(50),
    CONSTRAINT poi_pk PRIMARY KEY (id)
);

INSERT INTO puntosDeInteres (nombre,tipo,distrito,geometria) VALUES ('Biblioteca Pública de Santa Ana','C',1,POINT(-84.180588,9.933001));
INSERT INTO puntosDeInteres (nombre,tipo,distrito) VALUES ('Municipalidad de Santa Ana','G',1);
INSERT INTO puntosDeInteres (nombre,tipo,distrito) VALUES ('EMAI','C',1);
INSERT INTO puntosDeInteres (nombre,tipo,distrito) VALUES ('Escuela Ezequiel Morales','E',3);
INSERT INTO puntosDeInteres (nombre,tipo,distrito) VALUES ('Escuela Republica de Francia','E',5);
INSERT INTO puntosDeInteres (nombre,tipo,distrito) VALUES ('Escuela Isabel la Católica','E',4);

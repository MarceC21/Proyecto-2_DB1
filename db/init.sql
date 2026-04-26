-- Aquí esta el script para crear la base de datos y las tablas necesarias para el proyecto la tienda

-- Creacion de la base de datos
CREATE DATABASE Proyecto2

-- Creación de tablas 

-- CATEGORIA
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- PROVEEDOR
-- Se uso unique para que los emails no se repitan 
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE
);

-- CLIENTE
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150) UNIQUE
);

-- PUESTO
CREATE TABLE puesto (
    id_puesto SERIAL PRIMARY KEY,
    nombre_puesto VARCHAR(50) NOT NULL UNIQUE
);

-- EMPLEADO
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre_empleado VARCHAR(100) NOT NULL,
    id_puesto INT NOT NULL,

    FOREIGN KEY (id_puesto) REFERENCES puesto(id_puesto)
);


-- PRODUCTO
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    precio_producto DECIMAL(10,2) NOT NULL CHECK (precio_producto >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,

    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);


-- VENTA
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

-- DETALLE VENTA 
CREATE TABLE detalle_venta (
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),

    PRIMARY KEY (id_venta, id_producto),

    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- COMPRA
CREATE TABLE compra (
    id_compra SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    id_proveedor INT NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

-- DETALLE COMPRA
CREATE TABLE detalle_compra (
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    costo_unitario DECIMAL(10,2) NOT NULL CHECK (costo_unitario >= 0),

    PRIMARY KEY (id_compra, id_producto),

    FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);


-- -------------------------------------------------------------------------------------------

-- INSERTS 

-- Categorias
INSERT INTO categoria (nombre_categoria) VALUES
('Bebidas'),
('Snacks'),
('Lácteos'),
('Frutas'),
('Verduras'),
('Panadería'),
('Enlatados'),
('Limpieza'),
('Cuidado personal'),
('Congelados'),
('Bebidas alcohólicas'),
('Cereales'),
('Pastas'),
('Salsas'),
('Condimentos'),
('Dulces'),
('Repostería'),
('Mascotas'),
('Papelería'),
('Electrónicos pequeños'),
('Otros 1'),
('Otros 2'),
('Otros 3'),
('Otros 4'),
('Otros 5');

-- Proveedores
INSERT INTO proveedor (nombre_proveedor, telefono, email) VALUES
('Distribuidora Central', '55510001', 'central@proveedor.com'),
('Bebidas Unidas', '55510002', 'bebidas@proveedor.com'),
('Lácteos del Valle', '55510003', 'lacteos@proveedor.com'),
('Frutas y Verduras SA', '55510004', 'fyv@proveedor.com'),
('Panadería La Espiga', '55510005', 'pan@proveedor.com'),
('Snacks Express', '55510006', 'snacks@proveedor.com'),
('Alimentos Enlatados SA', '55510007', 'enlatados@proveedor.com'),
('Productos Limpios', '55510008', 'limpieza@proveedor.com'),
('Cuidado Total', '55510009', 'cuidado@proveedor.com'),
('Congelados del Norte', '55510010', 'congelados@proveedor.com'),
('Alimentos del Sur', '55510011', 'sur@proveedor.com'),
('Distribuidora El Sol', '55510012', 'sol@proveedor.com'),
('Importaciones Rivera', '55510013', 'rivera@proveedor.com'),
('Comercial López', '55510014', 'lopez@proveedor.com'),
('Productos Selectos', '55510015', 'selectos@proveedor.com'),
('Distribuidora Oriente', '55510016', 'oriente@proveedor.com'),
('Alimentos Premium', '55510017', 'premium@proveedor.com'),
('La Buena Mesa', '55510018', 'mesa@proveedor.com'),
('Distribuidora La Unión', '55510019', 'union@proveedor.com'),
('Importadora García', '55510020', 'garcia@proveedor.com'),
('Suministros del Norte', '55510021', 'norte@proveedor.com'),
('Comercial Díaz', '55510022', 'diaz@proveedor.com'),
('Distribuidora Express', '55510023', 'express@proveedor.com'),
('Alimentos San José', '55510024', 'sanjose@proveedor.com'),
('Grupo Comercial Morales', '55510025', 'morales@proveedor.com');

-- Clientes
INSERT INTO cliente (nombre_cliente, telefono, email) VALUES
('Juan Pérez','55520001','juan1@mail.com'),
('María López','55520002','maria2@mail.com'),
('Carlos Gómez','55520003','carlos3@mail.com'),
('Ana Torres','55520004','ana4@mail.com'),
('Luis Martínez','55520005','luis5@mail.com'),
('Sofía Ramírez','55520006','sofia6@mail.com'),
('Pedro Castillo','55520007','pedro7@mail.com'),
('Laura Díaz','55520008','laura8@mail.com'),
('Jorge Morales','55520009','jorge9@mail.com'),
('Elena Vargas','55520010','elena10@mail.com'),
('Miguel Castro','55520011','miguel11@mail.com'),
('Lucía Herrera','55520012','lucia12@mail.com'),
('Andrés Flores','55520013','andres13@mail.com'),
('Paola Méndez','55520014','paola14@mail.com'),
('Ricardo Soto','55520015','ricardo15@mail.com'),
('Daniela Cruz','55520016','daniela16@mail.com'),
('Fernando Ríos','55520017','fernando17@mail.com'),
('Carmen Vega','55520018','carmen18@mail.com'),
('Raúl Navarro','55520019','raul19@mail.com'),
('Patricia León','55520020','patricia20@mail.com'),
('Hugo Reyes','55520021','hugo21@mail.com'),
('Verónica Peña','55520022','veronica22@mail.com'),
('Oscar Campos','55520023','oscar23@mail.com'),
('Natalia Ruiz','55520024','natalia24@mail.com'),
('Diego Silva','55520025','diego25@mail.com');

-- Puestos
INSERT INTO puesto (nombre_puesto) VALUES
('Cajero'),
('Supervisor'),
('Encargado');


-- Empleados
INSERT INTO empleado (nombre_empleado, id_puesto) VALUES
('Carlos Admin',1),
('Ana Supervisor',2),
('Luis Ventas',1),
('Marta López',3),
('Pedro Ruiz',1),
('José Hernández',1),
('María González',1),
('Luis Ramírez',2),
('Andrea Castillo',1),
('Fernando Morales',3),
('Claudia Pérez',1),
('Roberto Sánchez',1),
('Karla Jiménez',2),
('Daniel Ortega',1),
('Patricia Aguilar',3),
('Miguel Herrera',1),
('Sandra López',1),
('Jorge Mendoza',2),
('Ana Ruiz',1),
('Carlos Vega',3),
('Lucía Navarro',1),
('Pedro Estrada',1),
('Gabriela Flores',2),
('Raúl Castillo',1),
('Verónica Rivas',3);

-- Productos
INSERT INTO producto (nombre_producto, precio_producto, stock, id_categoria, id_proveedor) VALUES
('Coca Cola 600ml',5.50,50,1,2),
('Pepsi 600ml',5.00,40,1,2),
('Jugo de naranja',4.50,30,1,2),
('Agua pura',3.00,60,1,1),
('Papas fritas',6.00,25,2,6),
('Doritos',7.00,20,2,6),
('Galletas chocolate',5.00,35,2,6),
('Leche entera',8.00,20,3,3),
('Queso fresco',12.00,15,3,3),
('Yogurt',6.50,18,3,3),
('Manzana',2.00,100,4,4),
('Banano',1.50,120,4,4),
('Aguacate',3.50,40,4,4),
('Tomate',2.50,60,5,4),
('Cebolla',2.00,70,5,4),
('Pan francés',1.00,80,6,5),
('Pan dulce',1.50,50,6,5),
('Atún en lata',7.50,30,7,7),
('Frijoles enlatados',6.00,40,7,7),
('Detergente',15.00,20,8,8),
('Jabón de baño',4.00,35,9,9),
('Shampoo',18.00,15,9,9),
('Helado',10.00,10,10,10),
('Pizza congelada',25.00,8,10,10),
('Verduras mixtas congeladas',12.00,12,10,10);


-- Compra
INSERT INTO compra (fecha, id_proveedor, total) VALUES
('2026-04-01',1,500),
('2026-04-02',2,600),
('2026-04-03',3,450),
('2026-04-04',4,300),
('2026-04-05',5,200),
('2026-04-06',6,350),
('2026-04-07',7,400),
('2026-04-08',8,250),
('2026-04-09',9,270),
('2026-04-10',10,320),
('2026-04-11',11,410),
('2026-04-12',12,380),
('2026-04-13',13,420),
('2026-04-14',14,390),
('2026-04-15',15,360),
('2026-04-16',16,440),
('2026-04-17',17,300),
('2026-04-18',18,280),
('2026-04-19',19,350),
('2026-04-20',20,370),
('2026-04-21',21,450),
('2026-04-22',22,460),
('2026-04-23',23,330),
('2026-04-24',24,310),
('2026-04-25',25,290);


-- Detalle compra
INSERT INTO detalle_compra (id_compra, id_producto, cantidad, costo_unitario) VALUES
(1,1,20,4.00),
(2,2,15,3.80),
(3,3,10,3.50),
(4,4,25,2.00),
(5,5,20,4.00),
(6,6,18,5.00),
(7,7,22,4.50),
(8,8,12,6.00),
(9,9,10,10.00),
(10,10,15,5.50),
(11,4,30,2.50),
(11,5,15,4.20),
(12,6,20,5.50),
(12,7,18,4.80),
(13,8,15,6.20),
(13,9,10,10.00),
(14,10,12,5.00),
(14,11,40,1.30),
(15,12,50,1.00),
(15,13,20,2.80),
(16,14,30,2.00),
(16,15,25,1.90),
(17,16,60,0.60),
(17,17,40,1.10),
(18,18,20,6.00),
(18,19,25,5.50),
(19,20,10,10.00),
(19,21,20,2.50),
(20,22,15,12.00),
(20,23,10,8.00),
(21,24,8,18.00),
(22,25,12,9.00),
(23,1,30,4.00),
(24,2,25,3.80),
(25,3,20,3.50);


-- Venta

INSERT INTO venta (fecha, id_cliente, id_empleado, total) VALUES
('2026-04-11',1,1,20),
('2026-04-11',2,2,35),
('2026-04-11',3,1,15),
('2026-04-12',4,3,40),
('2026-04-12',5,1,22),
('2026-04-12',6,2,18),
('2026-04-13',7,3,50),
('2026-04-13',8,1,30),
('2026-04-13',9,2,45),
('2026-04-14',10,1,25),
('2026-04-14',11,3,60),
('2026-04-14',12,2,28),
('2026-04-15',13,1,33),
('2026-04-15',14,3,27),
('2026-04-15',15,2,48),
('2026-04-16',16,1,55),
('2026-04-16',17,2,20),
('2026-04-16',18,3,42),
('2026-04-17',19,1,36),
('2026-04-17',20,2,29),
('2026-04-17',21,3,31),
('2026-04-18',22,1,44),
('2026-04-18',23,2,38),
('2026-04-18',24,3,26),
('2026-04-19',25,1,52);



-- Detalle Venta
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1,1,2,5.50),
(2,2,3,5.00),
(3,3,2,4.50),
(4,4,5,3.00),
(5,5,1,6.00),
(6,6,2,7.00),
(7,7,3,5.00),
(8,8,1,8.00),
(9,9,1,12.00),
(10,10,2,6.50),
(11,2,2,5.00),
(11,5,1,6.00),
(12,3,3,4.50),
(12,7,2,5.00),
(13,4,5,3.00),
(13,1,2,5.50),
(14,5,2,6.00),
(14,6,1,7.00),
(15,6,3,7.00),
(15,8,1,8.00),
(16,7,2,5.00),
(16,9,1,12.00),
(17,8,1,8.00),
(17,10,2,6.50),
(18,9,1,12.00),
(18,11,6,2.00),
(19,10,2,6.50),
(19,12,8,1.50),
(20,11,6,2.00),
(20,13,3,3.50),
(21,12,8,1.50),
(22,13,3,3.50),
(23,14,4,2.50),
(24,15,5,2.00),
(25,16,10,1.00);



------------------------------------------------------------------------------------------

-- Indices para mejorar el rendimiento de las consultas

-- Indice para buscar ventas por fecha
CREATE INDEX idx_venta_fecha ON venta(fecha);

-- Indice para buscar productos por categoria
CREATE INDEX idx_producto_categoria ON producto(id_categoria);

-- Indice para buscar los detalles de una venta por producto
CREATE INDEX idx_detalleventa_producto ON detalle_venta(id_producto);


-- Indice para buscar ventas por cliente
CREATE INDEX idx_venta_cliente ON venta(id_cliente);



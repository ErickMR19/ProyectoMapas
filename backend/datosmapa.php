<?php
$data = array(
  array('X'=>9.933001, 'Y'=>-84.180588, 'nombre' => 'Biblioteca Pública de Santa Ana', 'telefono' => '2282-9106', 'distrito'=>1) ,
  array('X'=>9.933064, 'Y'=>-84.183308, 'nombre' => 'Diseños en Madera', 'telefono' => '2282-6073', 'distrito'=>1) ,
  array('X'=>9.930048, 'Y'=>-84.179911, 'nombre' => 'EMAI', 'telefono' => '2282-8888', 'distrito'=>1) ,
  array('X'=>9.928647, 'Y'=>-84.217152, 'nombre' => 'Escuela Ezequiel Morales', 'telefono' => '2282-8888', 'distrito'=>5),
  array('X'=>9.947663, 'Y'=>-84.188463, 'nombre' => 'Escuela Republica de Francia', 'telefono' => '2282-8888', 'distrito'=>3) ,
  array('X'=>9.933365, 'Y'=>-84.200190, 'nombre' => 'Escuela Isabel la Católica', 'telefono' => '2282-8888', 'distrito'=>4)
);

  header('Content-Type: application/json');
  print json_encode($data);
?>

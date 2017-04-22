<?php
  require 'PHPMailerAutoload.php';
  
  $name = $_REQUEST['name'];
  $email = $_REQUEST['email'];
  $comments = $_REQUEST['comments'];
  
	$message = "<h1>Mensaje desde Catastudio.com</h1><p>";
	$message.= "<h2>Nombre: " . $name . "</h2><p>";
	$message.= "<h2>Email: " . $email . "</h2><p>";
	$message.= "<h2>Comentarios: " . $comments . " </h2><p>";	
  
  $mail = new PHPMailer(); // create a new object
  $mail->IsSMTP(); // enable SMTP
  //$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
  $mail->SMTPAuth = true; // authentication enabled
  $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
  $mail->Host = "smtp.gmail.com";
  $mail->Port = 465; // or 587
  $mail->IsHTML(true);
  $mail->Username = "victor.cata82@gmail.com";
  $mail->Password = "familyclub";
  $mail->Subject = "CataStudio: Mensaje desde la web.";
  $mail->Body = $message;
  $mail->AddAddress("catarsis2001@hotmail.com");

   if($mail->Send()) {
      echo '1';
   } else {
      echo '0';
   }
?>
    
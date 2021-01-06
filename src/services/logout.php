<?php
  session_start();
  unset($_SESSION['user']);
  header('Location: ../containers/Login/index.php');
?>
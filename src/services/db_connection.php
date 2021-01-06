<?php

class DatabaseConnection{
  private static $instance;
  private $servername = "localhost";
  private $username = "root";
  private $password = "";
  private $dbname = "tetris";
  private $connection = null;

  private function __construct(){
  }

  private function createConnection(){
    try {
    $this->connection = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password);
    // connection the PDO error mode to exception
    $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage()."<br>";
    }
  }

  public static function getInstance(){
    if( self::$instance == null)
        self::$instance = new self();

    return self::$instance;
  }

  public function closeConnection(){
    $this->connection = null;
  }

  public function getConnection(){
    if($this->connection == null)
        $this->createConnection();
        
    return $this->connection;
  }
}
?>
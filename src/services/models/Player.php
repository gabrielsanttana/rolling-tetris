<?php
class Player{
  
    private $id;
    private $name;
    private $birthdate;
    private $cpf;
    private $phoneNumber;
    private $email;
    private $username;
    private $password;

    public function getId(){
      return $this->id;
    }

    public function getName(){
      return $this->name;
    }

    public function setName($name){
      $this->name = $name;
    }

    public function getBirthdate(){
      return $this->birthdate;
    }

    public function getCpf(){
      return $this->cpf;
    }

    public function getPhoneNumber(){
      return $this->phoneNumber;
    }

    public function setPhoneNumber($phoneNumber){
      $this->phoneNumber = $phoneNumber;
    }

    public function getEmail(){
      return $this->email;
    }

    public function setEmail($email){
      $this->email = $email;
    }

    public function getUsername(){
      return $this->username;
    }

    public function getPassword(){
      return $this->password;
    }

    public function setPassword($password){
      $this->password = $password;
    }

    public function __construct($name, $birthdate, $cpf, $phoneNumber, $email, $username, $password){
      $this->name = $name;
      $this->birthdate = $birthdate;
      $this->cpf = $cpf;
      $this->phoneNumber = $phoneNumber;
      $this->email = $email;
      $this->username = $username;
      $this->password = $password;
    }


    public static function constructWithId($id, $name, $birthdate, $cpf, $phoneNumber, $email, $username, $password){
      $instance = new self($name, $birthdate, $cpf, $phoneNumber, $email, $username, $password);
      $instance->id = $id;

      return $instance;
    } 
}
?>
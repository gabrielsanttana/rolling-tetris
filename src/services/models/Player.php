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
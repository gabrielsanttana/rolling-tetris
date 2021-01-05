<?php 

require_once(__DIR__.'/../models/Player.php');
require_once(__DIR__.'/../db_connection.php');

class PlayerDAO{


    private function __construct(){

    }

    public static function createPlayer($name, $birthdate, $cpf, $phoneNumber, $email, $username, $password){
        $connection = DatabaseConnection::getInstance()->getConnection();

        $lastInsertId = null;
        $query = "insert into player(name,birthdate,cpf,phoneNumber,email,username,password) values (
            '$name','$birthdate','$cpf','$phoneNumber','$email','$username','$password')";
 
        $result = $connection->query($query);

        if($result->rowCount() != 0){
            $lastInsertId = $connection->lastInsertId();
        }

        DatabaseConnection::getInstance()->closeConnection();
        return PlayerDAO::getPlayerById($lastInsertId);
    }

    public static function getPlayerById($id){
        $connection = DatabaseConnection::getInstance()->getConnection();
        
        $player = null;
        $query = "select * from player 
                    where id = $id;";
        
        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $result = $result->fetchAll()[0];

            $player = Player::constructWithId($result['id'], $result['name'], $result['birthdate'], $result['cpf'], $result['phoneNumber'], $result['email'], $result['username'], $result['password']);
        }

        DatabaseConnection::getInstance()->closeConnection();
        return $player;
    }

    public static function loginPlayer($username, $password){
        $connection = DatabaseConnection::getInstance()->getConnection();
        
        $player = null;
        $query = "select * from player 
        where username = '{$_POST['user']}' and password = '{$_POST['password']}';";
        
        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $result = $result->fetchAll()[0];

            echo "Resultado : ";
            echo var_dump($result);
            $player = Player::constructWithId($result['id'], $result['name'], $result['birthdate'], $result['cpf'], $result['phoneNumber'], $result['email'], $result['username'], $result['password']);
        }

        DatabaseConnection::getInstance()->closeConnection();
        return $player;
    }

    public static function updatePlayer(Player $player){
        $connection = DatabaseConnection::getInstance()->getConnection();

        $id = $player->getId();
        $name = $player->getName();
        $phoneNumber = $player->getPhoneNumber();
        $email = $player->getEmail();
        $password = $player->getPassword();

        $query = "update player 
                    set name = '$name',
                    phoneNumber = '$phoneNumber',
                    email = '$email',
                    password = '$password' 
                    where id = $id;";
        
        $result = $connection->query($query);
        if($result->rowCount() != 0){
            echo "Row count != 0";
        }

        DatabaseConnection::getInstance()->closeConnection();
    }


}



?>
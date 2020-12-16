<?php
    require 'db_connection.php';
    session_start();



    if(!$_POST){
        header('Location: ../containers/Login/index.php');
    }

    $method = $_POST['method'];

    
    $databaseConnection = new DatabaseConnection();

    switch($method ){
        case 'registerPlayer':
            $fieldsRequired = array("name","birthdate","cpf","phoneNumber","email","username","password");

            $player_data = array();

            foreach($fieldsRequired as $field){
                if(!$_POST[$field]){
                    //Retornar erro de campo não preenchido pro cadastro
                    header('Location: ../containers/Login/index.php');
                }
            }

            $query = "insert into player(name,birthdate,cpf,phoneNumber,email,username,password) values (
                '{$_POST['name']}','{$_POST['birthdate']}','{$_POST['cpf']}','{$_POST['phoneNumber']}','{$_POST['email']}','{$_POST['username']}','{$_POST['password']}')";
            

            $insertId= $databaseConnection->executeInsertSql($query);

            
            
            if($insertId != null){
                //Success
                $_SESSION['userId'] = $insertId;
                echo $insertId;
                header('Location: ../containers/Game/index.php');
            }else{
                //Retornar erro ae na hora de cadastrar
                header('Location: ../containers/Login/index.php');
            }

        break;
        case 'login':
            $fieldsRequired = array("user","password");

            foreach($fieldsRequired as $field){
                if(!$_POST[$field]){
                    //Retornar erro de campo não preenchido pro login
                    header('Location: ../containers/Login/index.php');
                }
            }

            $query = "select id from player 
            where username = '{$_POST['user']}' and password = '{$_POST['password']}';";
            

            $result = $databaseConnection->executeQuerySql($query);

            if($result->rowCount() != 0){
                $result_array = $result->fetchAll();
                $_SESSION['userId'] = $result_array[0]['id'];
                header('Location: ../containers/Game/index.php');
            }else{
                //Login errado
                header('Location: ../containers/Login/index.php');
            }

        break;
        default:
            header('Location: ../containers/Login/index.php');
        break;
    }




?>
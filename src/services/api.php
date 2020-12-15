<?php
    require 'db_connection.php';



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
                    //Retornar erro pro cadastro
                    redirectToLogin();
                }
            }

            $query = "insert into player(name,birthdate,cpf,phoneNumber,email,username,password) values (
                '{$_POST['name']}','{$_POST['birthdate']}','{$_POST['cpf']}','{$_POST['phoneNumber']}','{$_POST['email']}','{$_POST['username']}','{$_POST['password']}')";
            

            $databaseConnection->executeQuerySql($query);
        break;
        case 'login':
            $fieldsRequired = array("user","password");

            foreach($fieldsRequired as $field){
                if(!$_POST[$field]){
                    //Retornar erro pro login
                    redirectToLogin();
                }
            }

            $query = "select id from player 
            where username = '{$_POST['user']}' and password = '{$_POST['password']}';";
            

            $result = $databaseConnection->executeQuerySql($query);

            if($result->rowCount() != 0){
                $result_array = $result->fetchAll();
                echo 'Id do usuario : '.$result_array[0]['id'];
            }else{
                //Login errado
                redirectToLogin();
            }

        break;
        default:
            redirectToLogin();
        break;
    }


    function redirectToLogin(){
        header('Location: ../containers/Login/index.php');
    }



?>